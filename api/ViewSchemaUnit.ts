import Data from "./Data";
import { TView, NishanArg, ViewFormatProperties } from "../types";

/**
 * A class to represent a column schema of a collection and a view
 * @noInheritDoc
 */

export default class ViewSchemaUnit extends Data<TView> {
  schema_data: ViewFormatProperties;

  constructor(arg: NishanArg & { schema_data: ViewFormatProperties }) {
    super({ ...arg, type: "collection_view" });
    this.schema_data = arg.schema_data
  }

  async update(arg: Partial<Omit<ViewFormatProperties, "property">>) {
    const data = this.getCachedData();
    this.saveTransactions([this.updateOp([], {
      format: {
        ...data.format,
        [`${data.type}_properties`]: (data.format[`${data.type}_properties` as never] as ViewFormatProperties[]).map(properties => properties.property === this.schema_data.property ? { ...properties, ...arg } : properties)
      }
    })])
    this.updateCacheManually([this.id]);
  }
}