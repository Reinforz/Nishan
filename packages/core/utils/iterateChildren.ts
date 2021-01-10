import { warn } from "./logs";
import { FilterTypes, Logger, TMethodType, UpdateTypes } from "../types";
import { TData, TDataType } from "@nishans/types";

interface IterateOptions<T> {
  method: TMethodType,
  child_type: TDataType,
  child_ids: string[] | keyof T,
  multiple?: boolean,
  logger: Logger
  data: T,
  parent_type: TDataType
}

// cb1 is passed from the various iterate methods, cb2 is passed from the actual method
export const iterateChildren = async<T extends TData, TD, RD = TD>(args: FilterTypes<TD> | UpdateTypes<TD, RD>, transform: ((id: string) => TD | undefined), options: IterateOptions<T>, cb1?: (id: string, data: TD, updated_data: RD | undefined, index: number) => any, cb2?: ((id: string, data: TD, updated_data: RD, index: number) => any)) => {
  const matched_data: TD[] = [], { multiple = true, method, child_type, logger, data, parent_type, data: {id} } = options;
  const child_ids = ((Array.isArray(options.child_ids) ? options.child_ids : data[options.child_ids]) ?? []) as string[];
  const iterateUtil = async (child_id: string, current_data: TD, updated_data: RD | undefined, index: number) => {
    cb1 && await cb1(child_id, current_data, updated_data, index);
    cb2 && await cb2(child_id, current_data, updated_data as any, index);
    logger && logger(method, child_type, child_id);
    matched_data.push(current_data);
  }

  if (Array.isArray(args)) {
    for (let index = 0; index < args.length; index++) {
      const arg = args[index];
      if (Array.isArray(arg)) {
        const [child_id, updated_data] = arg, current_data = transform(child_id), matches = child_ids.includes(child_id);
        if (!current_data) warn(`Child:${child_id} does not exist in the cache`);
        else if (!matches) warn(`Child:${child_id} is not a child of ${parent_type}:${id}`);
        if (current_data && matches)
          await iterateUtil(child_id, current_data, updated_data, index)
      } else if (typeof arg === "string") {
        const child_id = arg, current_data = transform(child_id), matches = child_ids.includes(child_id);
        if (!current_data) warn(`Child:${child_id} does not exist in the cache`);
        else if (!matches) warn(`Child:${child_id} is not a child of ${parent_type}:${id}`);
        if (current_data && matches)
          await iterateUtil(child_id, current_data, undefined, index)
      }
      if (!multiple && matched_data.length === 1) break;
    }
  } else {
    for (let index = 0; index < child_ids.length; index++) {
      const child_id = child_ids[index], current_data = transform(child_id);
      if (!current_data) warn(`Child:${child_id} does not exist in the cache`);
      else {
        const matches = args ? await args(current_data, index) : true;
        if (current_data && matches)
          await iterateUtil(child_id, current_data, matches as RD, index)
      }
      if (!multiple && matched_data.length === 1) break;
    }
  }

  return matched_data;
}

export const iterateUpdateChildren = async<T extends TData, TD, RD>(args: UpdateTypes<TD, RD>, transform: ((id: string) => TD | undefined), options: IterateOptions<T>, cb1?: (id: string, data: TD, updated_data: RD | undefined) => any, cb2?: ((id: string, data: TD, updated_data: RD) => any)) => {
  const matched_data: TD[] = [], { multiple = true, child_type, logger, data, parent_type, data: {id} } = options;
  const child_ids = ((Array.isArray(options.child_ids) ? options.child_ids : data[options.child_ids]) ?? []) as string[];
  const iterateUtil = (child_id: string, current_data: TD, updated_data: RD) => {
    cb1 && cb1(child_id, current_data, updated_data);
    cb2 && cb2(child_id, current_data, updated_data);
    logger && logger("UPDATE", child_type, child_id);
    matched_data.push(current_data);
  }

  if (Array.isArray(args)) {
    for (let index = 0; index < args.length; index++) {
      const arg = args[index];
      const [child_id, updated_data] = arg, current_data = transform(child_id), matches = child_ids.includes(child_id);
      if (!current_data) warn(`${child_type}:${child_id} does not exist in the cache`);
      else if (!matches) warn(`${child_type}:${child_id} is not a child of ${parent_type}:${id}`);
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

  return matched_data;
}