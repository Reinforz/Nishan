import { IOperation, TDataType } from "@nishans/types";
import { Logger, RepositionParams } from "../types";
import { Operation } from "../utils";
import { detectChildData } from "./detectChildData";

interface PositionChildrenParam { logger: Logger, parent: any, child_id: string, position: RepositionParams, parent_type: TDataType, parent_id: string }

export function positionChildren(arg: PositionChildrenParam) {
  const { child_id, position, parent, parent_type, parent_id, logger } = arg;
  const [child_path] = detectChildData(parent_type,parent);
  if (!parent[child_path]) parent[child_path] = [];
  const container: string[] = parent[child_path];
  logger && logger("UPDATE", parent_type, parent_id);

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