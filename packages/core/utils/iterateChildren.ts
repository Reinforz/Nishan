import { warn } from "./logs";
import { FilterTypes, Logger, NishanArg, UpdateTypes } from "../types";
import { IOperation, TData, TDataType } from "@nishans/types";
import { Operation } from "../utils";
import { IterateAndDeleteOptions, IterateAndGetOptions, IterateAndUpdateOptions, IterateOptions } from "../src/Data";

interface IterateChildrenOptions<T, C> extends IterateOptions<T, C>, Pick<NishanArg, "cache">{
  parent_type: TDataType,
  parent_id: string,
  logger?: Logger
}
interface IterateAndGetChildrenOptions<T, C> extends IterateChildrenOptions<T, C>, IterateAndGetOptions<T, C>{
}

type IterateAndUpdateChildrenOptions<T, C> = Pick<NishanArg, "stack" | "user_id"> & IterateAndUpdateOptions<T, C> & IterateChildrenOptions<T, C>;
type IterateAndDeleteChildrenOptions<T, C> = Pick<NishanArg, "stack" | "user_id"> & IterateAndDeleteOptions<T, C> & IterateChildrenOptions<T, C>;

function updateLastEditedProps(block: any, user_id: string){
  block.last_edited_time = Date.now();
  block.last_edited_by_table = "notion_user";
  block.last_edited_by_id = user_id;
}

export async function iterateChildren<TD>(args: FilterTypes<TD>, cb: (id: string, data: TD)=> Promise<any> | any, transform: ((id: string) => TD | undefined), {multiple = true, child_type, parent_type, parent_id, child_ids}: {child_ids: string[], multiple?: boolean, child_type: TDataType, parent_type: TDataType, parent_id: string}){
  let total_matched = 0;
  
  if (Array.isArray(args)) {
    for (let index = 0; index < args.length; index++) {
      const child_id = args[index], child_data = transform(child_id), matches = child_ids.includes(child_id);
      if (!child_data) warn(`${child_type}:${child_id} does not exist in the cache`);
      else if (!matches) warn(`${child_type}:${child_id} is not a child of ${parent_type}:${parent_id}`);
      if (child_data && matches){
        total_matched++;
        await cb(child_id, child_data)
      }
      if (!multiple && total_matched === 1) break;
    }
  } else {
    for (let index = 0; index < child_ids.length; index++) {
      const child_id = child_ids[index], child_data = transform(child_id);
      if (!child_data) warn(`${child_type}:${child_id} does not exist in the cache`);
      else {
        const matches = args ? await args(child_data, index) : true;
        if (child_data && matches){
          total_matched++;
          await cb(child_id, child_data)
        }
      }
      if (!multiple && total_matched === 1) break;
    }
  }
}

export const iterateAndGetChildren = async<T extends TData, TD, C = any[]>(args: FilterTypes<TD>, transform: ((id: string) => TD | undefined), options: IterateAndGetChildrenOptions<T, C>, cb?: ((id: string, data: TD, container: C) => any)) => {
  const { container, parent_id, multiple = true, child_type, logger, cache, parent_type} = options,
    parent = cache[parent_type].get(parent_id) as T, child_ids = ((Array.isArray(options.child_ids) ? options.child_ids : parent[options.child_ids]) ?? []) as string[];

  const iterateUtil = async (child_id: string, child_data: TD) => {
    cb && await cb(child_id, child_data, container);
    logger && logger("READ", child_type, child_id);
  }

  await iterateChildren(args, iterateUtil, transform, {
    child_ids,
    multiple,
    child_type,
    parent_id,
    parent_type
  })

  return container;
}

export const iterateAndDeleteChildren = async<T extends TData, TD, C = any[]>(args: FilterTypes<TD>, transform: ((id: string) => TD | undefined), options: IterateAndDeleteChildrenOptions<T, C>, cb?: ((id: string, data: TD) => any)) => {
  const matched_data: TD[] = [], { child_path, user_id, multiple = true, manual = false, parent_id, child_type, logger, stack, cache, parent_type} = options,
    data = cache[parent_type].get(parent_id) as T, child_ids = ((Array.isArray(options.child_ids) ? options.child_ids : data[options.child_ids]) ?? []) as string[],
    last_updated_props = { last_edited_time: Date.now(), last_edited_by_table: "notion_user", last_edited_by_id: user_id };
  
  const updateData = async (child_id: string, child_data: TD) => {
    if (!manual) {
      (child_data as any).alive = false;
      updateLastEditedProps(child_data, user_id);
      stack.push(Operation[child_type].update(child_id, [], { alive: false, ...last_updated_props }));

      if (typeof child_path === "string") {
        data[child_path] = (data[child_path] as any).filter((id: string)=>id !== child_id) as any
        stack.push(Operation[parent_type].listRemove(parent_id, [child_path], { id: child_id }));
      }
    }

    cb && await cb(child_id, child_data);
    logger && logger("DELETE", child_type, child_id);
    matched_data.push(child_data);
  }

  await iterateChildren(args, updateData, transform, {
    child_ids,
    multiple,
    child_type,
    parent_id,
    parent_type
  });

  if(matched_data.length !== 0){
    updateLastEditedProps(data, user_id);
    stack.push(Operation[parent_type].update(parent_id, [], { ...last_updated_props }));
  }

  return matched_data;
}

// ! FIX:1:H Update deeply for example now it only replaces the top most properties
// if page.properties = {key1: value1, key2: value2} and updated properties = {key1: value1} it'll lose {key2:value2}  
export const iterateAndUpdateChildren = async<T extends TData, CD, RD, C = any[]>(args: UpdateTypes<CD, RD>, transform: ((id: string) => CD | undefined), options: IterateAndUpdateChildrenOptions<T, C>, cb?: ((id: string, child_data: CD, updated_data: RD, container: C) => any)) => {
  const { container = [], manual = false, user_id, parent_id, multiple = true, child_type, logger, cache, stack, parent_type } = options,
    data = cache[parent_type].get(parent_id) as T, child_ids = ((Array.isArray(options.child_ids) ? options.child_ids : data[options.child_ids]) ?? []) as string[],
    last_updated_props = { last_edited_time: Date.now(), last_edited_by_table: "notion_user", last_edited_by_id: user_id };

  let total_matched = 0;

  const iterateUtil = async (child_id: string, child_data: CD, updated_data: RD) => {
    if (child_type && !manual) {
      updateLastEditedProps(child_data, user_id);
      if(updated_data)
        Object.keys(updated_data).forEach((key)=>(child_data as any)[key] = updated_data[key as keyof RD])
      stack.push(Operation[child_type].update(child_id, [], { ...updated_data, ...last_updated_props }));
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

  stack.push(Operation[parent_type].update(parent_id, [], { ...last_updated_props }));

  return container as C;
}