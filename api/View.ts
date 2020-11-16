import { BlockRepostionArg, FilterTypes, ICollection, ISchemaUnit, NishanArg, Predicate, TCollectionBlock, TView, ViewAggregations, ViewFormatProperties } from "../types";
import Data from "./Data";
import ViewSchemaUnit from "./ViewSchemaUnit";

/**
 * A class to represent view of Notion
 * @noInheritDoc
 */
class View extends Data<TView> {
  constructor(arg: NishanArg) {
    super({ ...arg, type: "collection_view" });
  }

  async reposition(arg: number | BlockRepostionArg) {
    await this.saveTransactions([this.addToChildArray(this.id, arg) as any]);
  }

  /**
   * Update the current view
   * @param options Options to update the view
   */
  // ? TD:1:M Convert the parameter as an interface
  async update(options: { sorts?: [string, 1 | -1][], filters?: [string, string, string, string][], properties?: ViewFormatProperties[], aggregations?: ViewAggregations[] } = {}) {
    const data = this.getCachedData();
    const { sorts = [], filters = [], properties = [], aggregations = [] } = options;
    const args: any = {};

    if (sorts && sorts.length !== 0) {
      if (!args.query2) args.query2 = {};
      args.query2.sort = sorts.map((sort) => ({
        property: sort[0],
        direction: sort[1] === -1 ? 'ascending' : 'descending'
      }));
    }

    if (aggregations && aggregations.length !== 0) {
      if (!args.query2) args.query2 = {};
      args.query2.aggregations = aggregations;
    }

    if (filters && filters.length !== 0) {
      if (!args.query2) args.query2 = {};
      args.query2.filter = {
        operator: 'and',
        filters: filters.map((filter) => ({
          property: filter[0],
          filter: {
            operator: filter[1],
            value: {
              type: filter[2],
              value: filter[3]
            }
          }
        }))
      };
    }

    if (properties && properties.length !== 0) {
      args.format = { [`${data.type}_wrap`]: true };
      args.format[`${data.type}_properties`] = properties;
    }

    // ? FIX:2:H Respect previous filters and sorts
    await this.saveTransactions([this.updateOp([], args)]);
  }

  async getViewSchemaUnit(arg: string | Predicate<ViewFormatProperties>) {
    return (await this.getViewSchemaUnits(typeof arg === "string" ? [arg] : arg, false))[0]
  }

  async getViewSchemaUnits(arg: FilterTypes<ViewFormatProperties>, multiple: boolean = true) {
    const matched: ViewSchemaUnit[] = [];
    const collection = this.cache.collection.get((this.getParent() as TCollectionBlock).collection_id) as ICollection;
    const data = this.getCachedData(), container: ViewFormatProperties[] = data.format[`${data.type}_properties` as never] ?? [];
    const schema_ids = container.map(data => data.property);

    if (Array.isArray(arg)) {
      for (let index = 0; index < arg.length; index++) {
        const schema_id = arg[index];
        const should_add = schema_ids.includes(schema_id);
        if (should_add)
          matched.push(new ViewSchemaUnit({ ...this.getProps(), id: this.id, schema_id }))
        if (!multiple && matched.length === 1) break;
      }
    } else if (typeof arg === "function" || arg === undefined) {
      for (let index = 0; index < container.length; index++) {
        const schema_unit = collection.schema[container[index].property] as ISchemaUnit;
        const should_add = typeof arg === "function" ? await arg({ ...container[index], ...schema_unit }, index) : true;
        if (should_add)
          matched.push(new ViewSchemaUnit({ ...this.getProps(), id: this.id, schema_id: container[index].property, }))
        if (!multiple && matched.length === 1) break;
      }
    }
    return matched;
  }
}

export default View;