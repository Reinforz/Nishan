import { warn } from "./logs";
import { FilterTypes, Logger, NishanArg, UpdateTypes } from "../types";
import { IOperation, TData, TDataType } from "@nishans/types";
import { Operation } from "../utils";

interface IterateOptions<T> extends Omit<NishanArg, "id" | "space_id" | "shard_id" | "token" | "interval" | "logger" | "stack" | "user_id">{
  child_type: TDataType,
  child_ids: string[] | keyof T,
  multiple?: boolean,
  parent_type: TDataType,
  parent_id: string,
  logger?: Logger,
}
interface IterateAndGetOptions<T, C> extends IterateOptions<T>{
  container: C
}

interface IterateAndUpdateOptions<T, C> extends IterateOptions<T>{
  manual?:boolean
  stack: IOperation[],
  user_id: string,
  container?: C
}

interface IterateAndDeleteOptions<T> extends IterateOptions<T>{
  manual?:boolean
  child_path?: keyof T,
  stack: IOperation[],
  user_id: string
}

function updateLastEditedProps(block: any, user_id: string){
  block.last_edited_time = Date.now();
  block.last_edited_by_table = "notion_user";
  block.last_edited_by_id = user_id;
}

export const iterateAndGetChildren = async<T extends TData, TD, C>(args: FilterTypes<TD>, transform: ((id: string) => TD | undefined), options: IterateAndGetOptions<T, C>, cb?: ((id: string, data: TD, container: C) => any)) => {
  const { container, parent_id, multiple = true, child_type, logger, cache, parent_type} = options,
    parent = cache[parent_type].get(parent_id) as T, child_ids = ((Array.isArray(options.child_ids) ? options.child_ids : parent[options.child_ids]) ?? []) as string[];
  let total_matched = 0;
  const iterateUtil = async (child_id: string, current_data: TD) => {
    cb && await cb(child_id, current_data, container);
    logger && logger("READ", child_type, child_id);
    total_matched++;
  }

  if (Array.isArray(args)) {
    for (let index = 0; index < args.length; index++) {
      const child_id = args[index];
      const current_data = transform(child_id), matches = child_ids.includes(child_id);
      if (!current_data) warn(`${child_type}:${child_id} does not exist in the cache`);
      else if (!matches) warn(`${child_type}:${child_id} is not a child of ${parent_type}:${parent_id}`);
      if (current_data && matches)
        await iterateUtil(child_id, current_data)
      if (!multiple && total_matched === 1) break;
    }
  } else {
    for (let index = 0; index < child_ids.length; index++) {
      const child_id = child_ids[index], current_data = transform(child_id);
      if (!current_data) warn(`${child_type}:${child_id} does not exist in the cache`);
      else {
        const matches = args ? await args(current_data, index) : true;
        if (matches)
          await iterateUtil(child_id, current_data)
      }
      if (!multiple && total_matched === 1) break;
    }
  }

  return container;
}

export const iterateAndDeleteChildren = async<T extends TData, TD>(args: FilterTypes<TD>, transform: ((id: string) => TD | undefined), options: IterateAndDeleteOptions<T>, cb?: ((id: string, data: TD) => any)) => {
  const matched_data: TD[] = [], { child_path, user_id, manual = false, parent_id, multiple = true, child_type, logger, stack, cache, parent_type} = options,
    data = cache[parent_type].get(parent_id) as T, child_ids = ((Array.isArray(options.child_ids) ? options.child_ids : data[options.child_ids]) ?? []) as string[],
    last_updated_props = { last_edited_time: Date.now(), last_edited_by_table: "notion_user", last_edited_by_id: user_id };
  
  const iterateUtil = async (child_id: string, current_data: TD) => {
    if (child_type && !manual) {
      (current_data as any).alive = false;
      updateLastEditedProps(current_data, user_id);
      stack.push(Operation[child_type].update(child_id, [], { alive: false, ...last_updated_props }));
      if (typeof child_path === "string") {
        data[child_path] = (data[child_path] as any).filter((id: string)=>id !== child_id) as any
        stack.push(Operation[parent_type].listRemove(parent_id, [child_path], { id: child_id }));
      }
    }

    cb && await cb(child_id, current_data);
    logger && logger("DELETE", child_type, child_id);
    matched_data.push(current_data);
  }

  if (Array.isArray(args)) {
    for (let index = 0; index < args.length; index++) {
      const child_id = args[index], current_data = transform(child_id), matches = child_ids.includes(child_id);
      if (!current_data) warn(`${child_type}:${child_id} does not exist in the cache`);
      else if (!matches) warn(`${child_type}:${child_id} is not a child of ${parent_type}:${parent_id}`);
      if (current_data && matches)
        await iterateUtil(child_id, current_data)
      if (!multiple && matched_data.length === 1) break;
    }
  } else {
    for (let index = 0; index < child_ids.length; index++) {
      const child_id = child_ids[index], current_data = transform(child_id);
      if (!current_data) warn(`${child_type}:${child_id} does not exist in the cache`);
      else {
        const matches = args ? await args(current_data, index) : true;
        if (current_data && matches)
          await iterateUtil(child_id, current_data)
      }
      if (!multiple && matched_data.length === 1) break;
    }
  }

  updateLastEditedProps(data, user_id);

  stack.push(Operation[parent_type].update(parent_id, [], { ...last_updated_props }));

  return matched_data;
}

// ! FIX:1:H Update deeply for example now it only replaces the top most properties
// if page.properties = {key1: value1, key2: value2} and updated properties = {key1: value1} it'll lose {key2:value2}  
export const iterateAndUpdateChildren = async<T extends TData, CD, RD, C = any[]>(args: UpdateTypes<CD, RD>, transform: ((id: string) => CD | undefined), options: IterateAndUpdateOptions<T, C>, cb?: ((id: string, current_data: CD, updated_data: RD, container: C) => any)) => {
  const { container = [], manual = false, user_id, parent_id, multiple = true, child_type, logger, cache, stack, parent_type } = options,
    data = cache[parent_type].get(parent_id) as T, child_ids = ((Array.isArray(options.child_ids) ? options.child_ids : data[options.child_ids]) ?? []) as string[], ops: IOperation[] = [],
    last_updated_props = { last_edited_time: Date.now(), last_edited_by_table: "notion_user", last_edited_by_id: user_id };

  let total_matched = 0;

  const iterateUtil = async (child_id: string, current_data: CD, updated_data: RD) => {
    if (child_type && !manual) {
      updateLastEditedProps(current_data, user_id);
      if(updated_data)
        Object.keys(updated_data).forEach((key)=>(current_data as any)[key] = updated_data[key as keyof RD])
      ops.push(Operation[child_type].update(child_id, [], { ...updated_data, ...last_updated_props }));
    }
    
    cb && await cb(child_id, current_data, updated_data, container as any);
    logger && logger("UPDATE", child_type, child_id);
    total_matched++;
  }

  if (Array.isArray(args)) {
    for (let index = 0; index < args.length; index++) {
      const arg = args[index];
      const [child_id, updated_data] = arg, current_data = transform(child_id), matches = child_ids.includes(child_id);
      if (!current_data) warn(`${child_type}:${child_id} does not exist in the cache`);
      else if (!matches) warn(`${child_type}:${child_id} is not a child of ${parent_type}:${parent_id}`);
      if (current_data && matches)
        iterateUtil(child_id, current_data, updated_data)
      if (!multiple && total_matched === 1) break;
    }
  } else {
    for (let index = 0; index < child_ids.length; index++) {
      const child_id = child_ids[index], current_data = transform(child_id);
      if (!current_data) warn(`${child_type}:${child_id} does not exist in the cache`);
      else {
        const matches = args && await args(current_data, index);
        if (current_data && matches)
          iterateUtil(child_id, current_data, matches)
      }
      if (!multiple && total_matched === 1) break;
    }
  }

  updateLastEditedProps(data, user_id);

  ops.push(Operation[parent_type].update(parent_id, [], { ...last_updated_props }));
  stack.push(...ops);

  return container as C;
}