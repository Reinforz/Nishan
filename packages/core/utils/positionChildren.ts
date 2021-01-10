import { TOperationTable, IOperation } from "@nishans/types";
import { RepositionParams } from "../types";
import { Operation } from "../utils";

export function positionChildren(arg: { child_id: string, position: RepositionParams, container: string[], child_path: string, parent_type: TOperationTable, parent_id: string }) {
  const { child_id, position, container, child_path, parent_type, parent_id } = arg;
  if (position !== undefined) {
    let where: "before" | "after" = "before", id = '';
    if (typeof position === "number") {
      id = container?.[position] ?? '';
      where = container.indexOf(child_id) > position ? "before" : "after";
      container.splice(position, 0, child_id);
    } else {
      where = position.position, id = position.id;
      container.splice(container.indexOf(position.id) + (position.position === "before" ? -1 : 1), 0, child_id);
    }

    return (Operation[parent_type] as any)[`list${where.charAt(0).toUpperCase() + where.substr(1)}`](parent_id, [child_path], {
      [where]: id,
      id: child_id
    }) as IOperation
  } else {
    container.push(child_id);
    return Operation[parent_type].listAfter(parent_id, [child_path], {
      after: '',
      id: child_id
    }) as IOperation;
  }
}