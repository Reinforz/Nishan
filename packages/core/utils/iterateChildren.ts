import { warn } from "./logs";
import { FilterTypes, Logger, TMethodType, TSubjectType, UpdateTypes } from "../types";
import { TData, TDataType } from "@nishans/types";

interface IterateOptions<T> {
  method: TMethodType,
  subject_type: TSubjectType,
  child_ids: string[] | keyof T,
  multiple?: boolean,
  logger: Logger
  data: T,
  type: TDataType
}

// cb1 is passed from the various iterate methods, cb2 is passed from the actual method
export const iterateChildren = async<T extends TData, TD, RD = TD>(args: FilterTypes<TD> | UpdateTypes<TD, RD>, transform: ((id: string) => TD | undefined), options: IterateOptions<T>, cb1?: (id: string, data: TD, updated_data: RD | undefined, index: number) => any, cb2?: ((id: string, data: TD, updated_data: RD, index: number) => any)) => {
  const matched_data: TD[] = [], { multiple = true, method, subject_type, logger, data, type, data: {id} } = options;
  const child_ids = ((Array.isArray(options.child_ids) ? options.child_ids : data[options.child_ids]) ?? []) as string[];

  const iterateUtil = async (child_id: string, child_data: TD, updated_data: RD | undefined, index: number) => {
    cb1 && await cb1(child_id, child_data, updated_data, index);
    cb2 && await cb2(child_id, child_data, updated_data as any, index);
    logger && logger(method, subject_type, child_id);
    matched_data.push(child_data);
  }

  if (Array.isArray(args)) {
    for (let index = 0; index < args.length; index++) {
      const arg = args[index];
      if (Array.isArray(arg)) {
        const [child_id, updated_data] = arg, child_data = transform(child_id), matches = child_ids.includes(child_id);
        if (!child_data) warn(`Child:${child_id} does not exist in the cache`);
        else if (!matches) warn(`Child:${child_id} is not a child of ${type}:${id}`);
        if (child_data && matches)
          await iterateUtil(child_id, child_data, updated_data, index)
      } else if (typeof arg === "string") {
        const child_id = arg, child_data = transform(child_id), matches = child_ids.includes(child_id);
        if (!child_data) warn(`Child:${child_id} does not exist in the cache`);
        else if (!matches) warn(`Child:${child_id} is not a child of ${type}:${id}`);
        if (child_data && matches)
          await iterateUtil(child_id, child_data, undefined, index)
      }
      if (!multiple && matched_data.length === 1) break;
    }
  } else {
    for (let index = 0; index < child_ids.length; index++) {
      const child_id = child_ids[index], child_data = transform(child_id);
      if (!child_data) warn(`Child:${child_id} does not exist in the cache`);
      else {
        const matches = args ? await args(child_data, index) : true;
        if (child_data && matches)
          await iterateUtil(child_id, child_data, matches as RD, index)
      }
      if (!multiple && matched_data.length === 1) break;
    }
  }

  return matched_data;
}