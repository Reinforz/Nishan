import { warn } from "./logs";
import { FilterTypes, Logger, NishanArg, UpdateTypes } from "../types";
import { IOperation, TData, TDataType } from "@nishans/types";
import { Operation } from "../utils";
import { IterateAndGetOptions, IterateAndMutateOptions, IterateOptions } from "../src/Data";

interface IterateChildrenOptions<T, C> extends IterateOptions<T, C>, Pick<NishanArg, "cache" | "logger">{
  parent_type: TDataType,
  parent_id: string,
}
interface IterateAndGetChildrenOptions<T, C> extends IterateChildrenOptions<T, C>, IterateAndGetOptions<T, C>{
}

type IterateAndMutateChildrenOptions<T, C> = Pick<NishanArg, "stack" | "user_id"> & IterateAndMutateOptions<T, C> & IterateChildrenOptions<T, C>;

function updateLastEditedProps(block: any, user_id: string){
  block.last_edited_time = Date.now();
  block.last_edited_by_table = "notion_user";
  block.last_edited_by_id = user_id;
}

export const iterateAndGetChildren = async<T extends TData, TD, C>(args: FilterTypes<TD>, transform: ((id: string) => TD | undefined), options: IterateAndGetChildrenOptions<T, C>, cb?: ((id: string, data: TD, container: C) => any)) => {
  const { container, parent_id, multiple = true, child_type, logger, cache, parent_type} = options,
    parent = cache[parent_type].get(parent_id) as T, child_ids = ((Array.isArray(options.child_ids) ? options.child_ids : parent[options.child_ids]) ?? []) as string[];
  let total_matched = 0;
  const iterateUtil = async (child_id: string, child_data: TD) => {
    cb && await cb(child_id, child_data, container);
    logger && logger("READ", child_type, child_id);
    total_matched++;
  }

  if (Array.isArray(args)) {
    for (let index = 0; index < args.length; index++) {
      const child_id = args[index];
      const child_data = transform(child_id), matches = child_ids.includes(child_id);
      if (!child_data) warn(`${child_type}:${child_id} does not exist in the cache`);
      else if (!matches) warn(`${child_type}:${child_id} is not a child of ${parent_type}:${parent_id}`);
      if (child_data && matches)
        await iterateUtil(child_id, child_data)
      if (!multiple && total_matched === 1) break;
    }
  } else {
    for (let index = 0; index < child_ids.length; index++) {
      const child_id = child_ids[index], child_data = transform(child_id);
      if (!child_data) warn(`${child_type}:${child_id} does not exist in the cache`);
      else {
        const matches = args ? await args(child_data, index) : true;
        if (matches)
          await iterateUtil(child_id, child_data)
      }
      if (!multiple && total_matched === 1) break;
    }
  }

  return container;
}

export const iterateAndDeleteChildren = async<T extends TData, TD, C>(args: FilterTypes<TD>, transform: ((id: string) => TD | undefined), options: IterateAndMutateChildrenOptions<T, C>, cb?: ((id: string, data: TD) => any)) => {
  const matched_data: TD[] = [], { update_child_path, update_child = true, user_id, manual = false, parent_id, multiple = true, child_type, logger, stack, cache, parent_type} = options,
    data = cache[parent_type].get(parent_id) as T, child_ids = ((Array.isArray(options.child_ids) ? options.child_ids : data[options.child_ids]) ?? []) as string[],
    last_updated_props = { last_edited_time: Date.now(), last_edited_by_table: "notion_user", last_edited_by_id: user_id };
  
  const updateData = async (child_id: string, child_data: TD) => {
    if (!manual) {
      if(update_child){
        (child_data as any).alive = false;
        updateLastEditedProps(child_data, user_id);
        stack.push(Operation[child_type].update(child_id, [], { alive: false, ...last_updated_props }));
      }

      if (typeof update_child_path === "string") {
        data[update_child_path] = (data[update_child_path] as any).filter((id: string)=>id !== child_id) as any
        stack.push(Operation[parent_type].listRemove(parent_id, [update_child_path], { id: child_id }));
      }
    }

    cb && await cb(child_id, child_data);
    logger && logger("DELETE", child_type, child_id);
    matched_data.push(child_data);
  }

  if (Array.isArray(args)) {
    for (let index = 0; index < args.length; index++) {
      const child_id = args[index], child_data = transform(child_id), matches = child_ids.includes(child_id);
      if (!child_data) warn(`${child_type}:${child_id} does not exist in the cache`);
      else if (!matches) warn(`${child_type}:${child_id} is not a child of ${parent_type}:${parent_id}`);
      if (child_data && matches)
        await updateData(child_id, child_data)
      if (!multiple && matched_data.length === 1) break;
    }
  } else {
    for (let index = 0; index < child_ids.length; index++) {
      const child_id = child_ids[index], child_data = transform(child_id);
      if (!child_data) warn(`${child_type}:${child_id} does not exist in the cache`);
      else {
        const matches = args ? await args(child_data, index) : true;
        if (child_data && matches)
          await updateData(child_id, child_data)
      }
      if (!multiple && matched_data.length === 1) break;
    }
  }

  if(matched_data.length !== 0){
    updateLastEditedProps(data, user_id);
    stack.push(Operation[parent_type].update(parent_id, [], { ...last_updated_props }));
  }

  return matched_data;
}

// ! FIX:1:H Update deeply for example now it only replaces the top most properties
// if page.properties = {key1: value1, key2: value2} and updated properties = {key1: value1} it'll lose {key2:value2}  
export const iterateAndUpdateChildren = async<T extends TData, CD, RD, C = any[]>(args: UpdateTypes<CD, RD>, transform: ((id: string) => CD | undefined), options: IterateAndMutateChildrenOptions<T, C>, cb?: ((id: string, child_data: CD, updated_data: RD, container: C) => any)) => {
  const { container = [], manual = false, user_id, parent_id, multiple = true, child_type, logger, cache, stack, parent_type } = options,
    data = cache[parent_type].get(parent_id) as T, child_ids = ((Array.isArray(options.child_ids) ? options.child_ids : data[options.child_ids]) ?? []) as string[], ops: IOperation[] = [],
    last_updated_props = { last_edited_time: Date.now(), last_edited_by_table: "notion_user", last_edited_by_id: user_id };

  let total_matched = 0;

  const iterateUtil = async (child_id: string, child_data: CD, updated_data: RD) => {
    if (child_type && !manual) {
      updateLastEditedProps(child_data, user_id);
      if(updated_data)
        Object.keys(updated_data).forEach((key)=>(child_data as any)[key] = updated_data[key as keyof RD])
      ops.push(Operation[child_type].update(child_id, [], { ...updated_data, ...last_updated_props }));
    }
    
    cb && await cb(child_id, child_data, updated_data, container as any);
    logger && logger("UPDATE", child_type, child_id);
    total_matched++;
  }

  if (Array.isArray(args)) {
    for (let index = 0; index < args.length; index++) {
      const arg = args[index];
      const [child_id, updated_data] = arg, child_data = transform(child_id), matches = child_ids.includes(child_id);
      if (!child_data) warn(`${child_type}:${child_id} does not exist in the cache`);
      else if (!matches) warn(`${child_type}:${child_id} is not a child of ${parent_type}:${parent_id}`);
      if (child_data && matches)
        iterateUtil(child_id, child_data, updated_data)
      if (!multiple && total_matched === 1) break;
    }
  } else {
    for (let index = 0; index < child_ids.length; index++) {
      const child_id = child_ids[index], child_data = transform(child_id);
      if (!child_data) warn(`${child_type}:${child_id} does not exist in the cache`);
      else {
        const matches = args && await args(child_data, index);
        if (child_data && matches)
          iterateUtil(child_id, child_data, matches)
      }
      if (!multiple && total_matched === 1) break;
    }
  }

  updateLastEditedProps(data, user_id);

  ops.push(Operation[parent_type].update(parent_id, [], { ...last_updated_props }));
  stack.push(...ops);

  return container as C;
}