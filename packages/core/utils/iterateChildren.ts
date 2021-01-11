import { warn } from "./logs";
import { FilterTypes, NishanArg, UpdateTypes } from "../types";
import { IOperation, TData, TDataType } from "@nishans/types";
import { Operation } from "../utils";

interface IterateAndGetOptions<T> extends Omit<NishanArg, "id">{
  child_type: TDataType,
  child_ids: string[] | keyof T,
  multiple?: boolean,
  parent_type: TDataType,
  parent_id: string
}

interface IterateAndUpdateOptions<T> extends IterateAndGetOptions<T>{
  manual?:boolean
}

interface IterateAndDeleteOptions<T> extends IterateAndUpdateOptions<T>{
  child_path?: keyof T,
}

function updateLastEditedProps(block: any, user_id: string){
  block.last_edited_time = Date.now();
  block.last_edited_by_table = "notion_user";
  block.last_edited_by_id = user_id;
}

export const iterateAndGetChildren = async<T extends TData, TD>(args: FilterTypes<TD>, transform: ((id: string) => TD | undefined), options: IterateAndGetOptions<T>, cb?: ((id: string, data: TD) => any)) => {
  const matched_data: TD[] = [], { parent_id, multiple = true, child_type, logger, cache, parent_type} = options,
    data = cache[parent_type].get(parent_id) as T, child_ids = ((Array.isArray(options.child_ids) ? options.child_ids : data[options.child_ids]) ?? []) as string[];
  
  const iterateUtil = async (child_id: string, current_data: TD) => {
    cb && await cb(child_id, current_data);
    logger && logger("READ", child_type, child_id);
    matched_data.push(current_data);
  }

  if (Array.isArray(args)) {
    for (let index = 0; index < args.length; index++) {
      const arg = args[index];
      const child_id = arg, current_data = transform(child_id), matches = child_ids.includes(child_id);
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

  return matched_data;
}

export const iterateAndDeleteChildren = async<T extends TData, TD>(args: FilterTypes<TD>, transform: ((id: string) => TD | undefined), options: IterateAndDeleteOptions<T>, cb?: ((id: string, data: TD) => any)) => {
  const matched_data: TD[] = [], { child_path, user_id, manual = false, parent_id, multiple = true, child_type, logger, stack, cache, parent_type} = options,
    data = cache[parent_type].get(parent_id) as T, child_ids = ((Array.isArray(options.child_ids) ? options.child_ids : data[options.child_ids]) ?? []) as string[], ops: IOperation[] = [],
    last_updated_props = { last_edited_time: Date.now(), last_edited_by_table: "notion_user", last_edited_by_id: user_id };
  
  const iterateUtil = async (child_id: string, current_data: TD) => {
    if (child_type && !manual) {
      const block = cache[child_type].get(child_id) as any;
      block.alive = false;
      updateLastEditedProps(block, user_id);
      ops.push(Operation[child_type].update(child_id, [], { alive: false, ...last_updated_props }));
      if (typeof child_path === "string") {
        data[child_path] = (data[child_path] as any).filter((id: string)=>id !== child_id) as any
        ops.push(Operation[parent_type].listRemove(parent_id, [child_path], { id: child_id }));
      }
    }

    cb && await cb(child_id, current_data);
    logger && logger("DELETE", child_type, child_id);
    matched_data.push(current_data);
  }

  if (Array.isArray(args)) {
    for (let index = 0; index < args.length; index++) {
      const arg = args[index];
      const child_id = arg, current_data = transform(child_id), matches = child_ids.includes(child_id);
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

  ops.push(Operation[parent_type].update(parent_id, [], { ...last_updated_props }));
  stack.push(...ops);

  return matched_data;
}

// ! FIX:1:H Update deeply for example now it only replaces the top most properties
// if page.properties = {key1: value1, key2:value2} and updated properties = {key1: value1} it'll lose {key2:value2}  
export const iterateAndUpdateChildren = async<T extends TData, CD, RD>(args: UpdateTypes<CD, RD>, transform: ((id: string) => CD | undefined), options: IterateAndUpdateOptions<T>, cb?: ((id: string, current_data: CD, updated_data: RD) => any)) => {
  const matched_data: CD[] = [], { manual = false, user_id, parent_id, multiple = true, child_type, logger, cache, stack, parent_type } = options,
    data = cache[parent_type].get(parent_id) as T, child_ids = ((Array.isArray(options.child_ids) ? options.child_ids : data[options.child_ids]) ?? []) as string[], ops: IOperation[] = [],
    last_updated_props = { last_edited_time: Date.now(), last_edited_by_table: "notion_user", last_edited_by_id: user_id };

  const iterateUtil = async (child_id: string, current_data: CD, updated_data: RD) => {
    if (child_type && !manual) {
      const block = cache[child_type].get(child_id) as any;
      updateLastEditedProps(block, user_id);
      if(updated_data)
        Object.keys(updated_data).forEach((key)=>block[key] = updated_data[key as keyof RD])
      ops.push(Operation[child_type].update(child_id, [], { ...updated_data, ...last_updated_props }));
    }
    
    cb && await cb(child_id, current_data, updated_data);
    logger && logger("UPDATE", child_type, child_id);
    matched_data.push(current_data);
  }

  if (Array.isArray(args)) {
    for (let index = 0; index < args.length; index++) {
      const arg = args[index];
      const [child_id, updated_data] = arg, current_data = transform(child_id), matches = child_ids.includes(child_id);
      if (!current_data) warn(`${child_type}:${child_id} does not exist in the cache`);
      else if (!matches) warn(`${child_type}:${child_id} is not a child of ${parent_type}:${parent_id}`);
      if (current_data && matches)
        iterateUtil(child_id, current_data, updated_data)
      if (!multiple && matched_data.length === 1) break;
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
      if (!multiple && matched_data.length === 1) break;
    }
  }

  updateLastEditedProps(data, user_id);

  ops.push(Operation[parent_type].update(parent_id, [], { ...last_updated_props }));
  stack.push(...ops);

  return matched_data;
}