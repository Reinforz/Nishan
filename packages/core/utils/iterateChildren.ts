import { warn } from "./logs";
import { FilterTypes, Logger, NishanArg, UpdateTypes } from "../types";
import { TData, TDataType } from "@nishans/types";
import { Operation } from "../utils";
import { IterateAndDeleteOptions, IterateAndGetOptions, IterateAndUpdateOptions, IterateOptions } from "../src/Data";
import { deepMerge } from "../src";

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

type IterateChildren<TD = any, RD = any> = {
  args: FilterTypes<TD>,
  cb: (id: string, data: TD) => any,
  method: "READ" | "DELETE",
} | {
  args: UpdateTypes<TD, RD>,
  cb: (id: string, data: TD, updated_data: RD) => any,
  method: "UPDATE",
}

export async function iterateChildren<TD, RD = any>(args: IterateChildren<TD, RD>, transform: ((id: string) => TD | undefined), {multiple = true, child_type, parent_type, parent_id, child_ids}: {child_ids: string[], multiple?: boolean, child_type: TDataType, parent_type: TDataType, parent_id: string}){
  let total_matched = 0;
  if (Array.isArray(args.args)) {
    for (let index = 0; index < args.args.length; index++) {
      const child_id = args.method === "UPDATE" ? args.args[index][0] : args.args[index],
        child_data = transform(child_id),
        matches = child_ids.includes(child_id);
      
      if (!child_data) warn(`${child_type}:${child_id} does not exist in the cache`);
      if (!matches) warn(`${child_type}:${child_id} is not a child of ${parent_type}:${parent_id}`);

      if (child_data && matches){
        total_matched++;
        if(args.method === "UPDATE")
          await args.cb(child_id, child_data, args.args[index][1])
        else 
          await args.cb(child_id, child_data)
      }
      if (!multiple && total_matched === 1) break;
    }
  } else {
    for (let index = 0; index < child_ids.length; index++) {
      const child_id = child_ids[index], child_data = transform(child_id);
      if (!child_data) warn(`${child_type}:${child_id} does not exist in the cache`);
      else {
        if(args.method === "UPDATE"){
          const updated_data = args.args && await args.args(child_data, index);
          if (child_data && updated_data){
            total_matched++;
            await args.cb(child_id, child_data, updated_data)
          }
        }else{
          const matches = args.args && await args.args(child_data, index);
          if (child_data && matches){
            total_matched++;
            await args.cb(child_id, child_data)
          }
        }
      }
      if (!multiple && total_matched === 1) break;
    }
  }
}

export const iterateAndGetChildren = async<T extends TData, TD, C = any[]>(args: FilterTypes<TD>, transform: ((id: string) => TD | undefined), options: IterateAndGetChildrenOptions<T, C>, cb?: ((id: string, data: TD, container: C) => any)) => {
  const { container, parent_id, multiple = true, child_type, logger, cache, parent_type} = options,
    parent = cache[parent_type].get(parent_id) as T, child_ids = ((Array.isArray(options.child_ids) ? options.child_ids : parent[options.child_ids])) as string[];

  const iterateUtil = async (child_id: string, child_data: TD) => {
    cb && await cb(child_id, child_data, container);
    logger && logger("READ", child_type, child_id);
  }

  await iterateChildren<TD, boolean>({args, method: "READ", cb: iterateUtil}, transform, {
    child_ids,
    multiple,
    child_type,
    parent_id,
    parent_type
  })

  return container;
}

export const iterateAndDeleteChildren = async<T extends TData, TD, C = any[]>(args: FilterTypes<TD>, transform: ((id: string) => TD | undefined), options: IterateAndDeleteChildrenOptions<T, C>, cb?: ((id: string, data: TD, container: C) => any)) => {
  const { container, child_path, user_id, multiple = true, manual = false, parent_id, child_type, logger, stack, cache, parent_type} = options,
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

    cb && await cb(child_id, child_data, container);
    logger && logger("DELETE", child_type, child_id);
  }

  await iterateChildren<TD, boolean>({args, cb: updateData, method: "DELETE"}, transform, {
    child_ids,
    multiple,
    child_type,
    parent_id,
    parent_type
  });

  if(data){
    updateLastEditedProps(data, user_id);
    stack.push(Operation[parent_type].update(parent_id, [], { ...last_updated_props }));
  }

  return container;
}

export const iterateAndUpdateChildren = async<T extends TData, CD, RD, C = any[]>(args: UpdateTypes<CD, RD>, transform: ((id: string) => CD | undefined), options: IterateAndUpdateChildrenOptions<T, C>, cb?: ((id: string, child_data: CD, updated_data: RD, container: C) => any)) => {
  const { container, manual = false, user_id, parent_id, multiple = true, child_type, logger, cache, stack, parent_type } = options,
    data = cache[parent_type].get(parent_id) as T, child_ids = ((Array.isArray(options.child_ids) ? options.child_ids : data[options.child_ids])) as string[],
    last_updated_props = { last_edited_time: Date.now(), last_edited_by_table: "notion_user", last_edited_by_id: user_id };

  const iterateUtil = async (child_id: string, child_data: CD, updated_data: RD) => {
    if (!manual) {
      updateLastEditedProps(child_data, user_id);
      deepMerge(child_data ,updated_data);
      stack.push(Operation[child_type].update(child_id, [], { ...updated_data, ...last_updated_props }));
    }
    
    cb && await cb(child_id, child_data, updated_data, container);
    logger && logger("UPDATE", child_type, child_id);
  }

  await iterateChildren<CD, RD>({args, cb: iterateUtil, method: "UPDATE"}, transform, {
    child_ids,
    multiple,
    child_type,
    parent_id,
    parent_type
  });

  if(data){
    updateLastEditedProps(data, user_id);
    stack.push(Operation[parent_type].update(parent_id, [], { ...last_updated_props }));
  }

  return container as C;
}