import { Operation } from "@nishans/operations";
import { TData } from "@nishans/types";
import { updateChildContainer } from "../../libs/updateChildContainer";
import { FilterTypes, IterateAndDeleteChildrenOptions } from "../../types";
import { iterateChildren, updateLastEditedProps } from "./utils";

/**
 * Iterates over the children of a parent and deletes it
 * @param args Array of ids or a cb passed with the transformed data
 * @param transform Cb to get the data using the id
 * @param options Options for delete function
 * @param cb additional callback
 */
export const remove = async<T extends TData, TD, C = any[]>(args: FilterTypes<TD>, transform: ((id: string) => TD | undefined | Promise<TD | undefined>), options: IterateAndDeleteChildrenOptions<T, C>, cb?: ((id: string, data: TD, container: C) => any)) => {
  const { container, child_path, user_id, multiple = true, manual = false, parent_id, child_type, logger, stack, cache, parent_type} = options,
    // get the data from the cache
    data = cache[parent_type].get(parent_id) as T, 
    // Get the child ids array
    child_ids = ((Array.isArray(options.child_ids) ? options.child_ids : data[options.child_ids]) ?? []) as string[],
    last_updated_props = { last_edited_time: Date.now(), last_edited_by_table: "notion_user", last_edited_by_id: user_id };
  
  const updateData = async (child_id: string, child_data: TD) => {
    // If the update is not manual, 
    if (!manual) {
      // Set the alive property to false, as its deleted
      (child_data as any).alive = false;
      // Update the last edited props of the data
      updateLastEditedProps(child_data, user_id);
      // Push the updated block data to the stack
      stack.push(Operation[child_type].update(child_id, [], { alive: false, ...last_updated_props }));

      if (typeof child_path === "string")
        updateChildContainer(data, false, child_id, child_path, stack, parent_type)
    }

    // Call the cb with the appropriate arguments if it exists
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

  // if parent data exists, update the last_edited_props for the cache and push to stack
  if(data){
    updateLastEditedProps(data, user_id);
    stack.push(Operation[parent_type].update(parent_id, [], { ...last_updated_props }));
  }

  return container;
}