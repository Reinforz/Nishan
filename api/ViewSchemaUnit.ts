import Data from "./Data";
import { TView, NishanArg, ViewFormatProperties } from "../types";

/**
 * A class to represent a column schema of a collection and a view
 * @noInheritDoc
 */

export default class ViewSchemaUnit extends Data<TView> {
  schema_data: ViewFormatProperties;

  constructor(arg: NishanArg & { schema_data: ViewFormatProperties }) {
    super({ ...arg, type: "collection" });
    this.schema_data = arg.schema_data
  }
}