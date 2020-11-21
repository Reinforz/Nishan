import { RepositionParams, FilterType, FilterTypes, ICollection, ISchemaUnit, NishanArg, TCollectionBlock, TView, ViewAggregations, ViewFormatProperties, TSchemaUnit, TSortValue, ViewSorts } from "../../types";
import Data from "../Data";
import ViewSchemaUnit from "../ViewSchemaUnit";

/**
 * A class to represent view of Notion
 * @noInheritDoc
 */
class View extends Data<TView> {
  constructor(arg: NishanArg) {
    super({ ...arg, type: "collection_view" });
  }

  async reposition(arg: RepositionParams) {
    await this.saveTransactions([this.addToChildArray(this.id, arg) as any]);
  }

  /**
   * Update the current view
   * @param options Options to update the view
   */
  // ? TD:1:M Use the createViews method arg
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

  async getViewSchemaUnit(arg: FilterType<ViewFormatProperties>) {
    return (await this.getViewSchemaUnits(typeof arg === "string" ? [arg] : arg, false))[0]
  }

  async getViewSchemaUnits(arg: FilterTypes<ViewFormatProperties & ISchemaUnit>, multiple: boolean = true) {
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

  async createSort(cb: (T: TSchemaUnit & { key: string }) => [TSortValue, number] | undefined) {
    await this.createSorts(cb, false)
  }

  async createSorts(cb: (T: TSchemaUnit & { key: string }) => [TSortValue, number] | undefined, multiple?: boolean) {
    multiple = multiple ?? true;
    const data = this.getCachedData(), collection = this.cache.collection.get((this.cache.block.get(data.parent_id) as TCollectionBlock).collection_id) as ICollection;
    if (!data.query2) data.query2 = { sort: [] as ViewSorts[] } as any;
    if (!data.query2?.sort) (data.query2 as any).sort = [] as ViewSorts[];
    let total_created = 0;
    const sorts = data.query2?.sort ?? [] as ViewSorts[];
    const schema_entries = Object.entries(collection.schema);
    for (let index = 0; index < schema_entries.length; index++) {
      const [key, schema] = schema_entries[index];
      const res = cb({ ...schema, key }) ?? undefined;
      if (res) {
        total_created++;
        const [direction, position] = res;
        sorts.splice(position ?? sorts.length, 0, {
          property: key,
          direction
        })
      }
      if (!multiple && total_created === 1) break;
    }

    if (total_created) {
      await this.saveTransactions([this.updateOp([], {
        query2: {
          ...data.query2
        }
      })]);
      await this.updateCacheManually([this.id]);
    }
  }

  async deleteSort(cb: (T: TSchemaUnit & ViewSorts) => boolean | undefined) {
    await this.deleteSorts(cb, false);
  }

  async deleteSorts(cb: (T: TSchemaUnit & ViewSorts) => boolean | undefined, multiple?: boolean) {
    multiple = multiple ?? true;
    const data = this.getCachedData(), collection = this.cache.collection.get((this.cache.block.get(data.parent_id) as TCollectionBlock).collection_id) as ICollection;
    let total_deleted = 0;
    const sorts = data.query2?.sort ?? [] as ViewSorts[];
    const schema_entries = new Map(Object.entries(collection.schema));

    for (let index = 0; index < sorts.length; index++) {
      const sort = sorts[index] as ViewSorts;
      const schema = schema_entries.get(sort.property)
      const should_delete = cb({ ...sort, ...schema } as any) ?? undefined;
      if (should_delete) {
        total_deleted++;
        sorts.splice(index, 1)
      }
      if (!multiple && total_deleted === 1) break;
    }

    if (total_deleted) {
      await this.saveTransactions([this.updateOp([], {
        query2: {
          ...data.query2
        }
      })]);
      await this.updateCacheManually([this.id]);
    }
  }
}

export default View;