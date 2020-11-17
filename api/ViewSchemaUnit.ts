import Data from "./Data";
import { TView, NishanArg, ViewFormatProperties } from "../types";

/**
 * A class to represent a column schema of a collection and a view
 * @noInheritDoc
 */

export default class ViewSchemaUnit extends Data<TView> {
  schema_id: string;

  constructor(arg: NishanArg & { schema_id: string }) {
    super({ ...arg, type: "collection_view" });
    this.schema_id = arg.schema_id
  }

  async update(arg: Partial<Omit<ViewFormatProperties, "property">>) {
    const data = this.getCachedData(), container = data.format[`${data.type}_properties` as never] as ViewFormatProperties[];
    this.saveTransactions([this.updateOp([], {
      format: {
        ...data.format,
        [`${data.type}_properties`]: container.map(properties => properties.property === this.schema_id ? { ...properties, ...arg } : properties)
      }
    })])
    this.updateCacheManually([this.id]);
  }

  async toggleHide(should_hide?: boolean) {
    const data = this.getCachedData(), container = data.format[`${data.type}_properties` as never] as ViewFormatProperties[];
    this.saveTransactions([this.updateOp([], {
      format: {
        ...data.format,
        [`${data.type}_properties`]: container.map(properties => properties.property === this.schema_id ? { ...properties, visible: should_hide ?? (!properties.visible) } : properties)
      }
    })])
    this.updateCacheManually([this.id]);
  }

  async addSort(direction: "ascending" | "descending" = "ascending") {
    const data = this.getCachedData();
    const container = data?.query2?.sort ?? [];
    container.push({ property: this.schema_id, direction })
    this.saveTransactions([this.updateOp([], {
      query2: {
        ...data.query2,
        sort: container
      }
    })])
    this.updateCacheManually([this.id]);
  }

}