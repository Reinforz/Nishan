import { Operation } from "@nishans/operations";
import { TData } from "@nishans/types";
import { FilterTypes, IterateAndDeleteChildrenOptions } from "../../types";
import { iterateChildren, updateLastEditedProps } from "./utils";

export const remove = async<T extends TData, TD, C = any[]>(args: FilterTypes<TD>, transform: ((id: string) => TD | undefined | Promise<TD | undefined>), options: IterateAndDeleteChildrenOptions<T, C>, cb?: ((id: string, data: TD, container: C) => any)) => {
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