import { RepositionParams, ICollection, ISchemaUnit, NishanArg, TCollectionBlock, TView, ViewAggregations, ViewFormatProperties, TSchemaUnit, TSortValue, ViewSorts, UserViewFilterParams, TViewFilters, ViewUpdateParam, UpdateTypes } from "../../types";
import Data from "../Data";

/**
 * A class to represent view of Notion
 * @noInheritDoc
 */
class View<T extends TView> extends Data<T> {
  constructor(arg: NishanArg) {
    super({ ...arg, type: "collection_view" });
  }

  async reposition(arg: RepositionParams) {
    await this.saveTransactions([this.addToChildArray(this.id, arg)]);
  }

  /**
   * Update the current view
   * @param options Options to update the view
   */
  // ? TD:1:M Use the Data.createViews method
  async update(options: ViewUpdateParam[]) {
    const data = this.getCachedData(), collection = this.cache.collection.get((this.getParent() as TCollectionBlock).collection_id) as ICollection;
    const name_map: Record<string, { key: string } & ISchemaUnit> = {};
    Object.entries(collection.schema).forEach(([key, schema]) => name_map[schema.name] = { key, ...schema })

    const sorts = [] as ViewSorts[], filters = [] as TViewFilters[], aggregations = [] as ViewAggregations[], properties = [] as ViewFormatProperties[];

    for (let index = 0; index < options.length; index++) {
      const { name, format, sort, aggregation, filter } = options[index];
      const { key } = name_map[name];

      if (name) {
        const property: ViewFormatProperties = {
          property: key,
        } as any;
        if (typeof format === "boolean") property.visible = format;
        else if (typeof format === "number") property.width = format;
        else if (Array.isArray(format)) {
          property.width = format?.[1] ?? 250
          property.visible = format?.[0] ?? true;
        }
        if (sort) sorts.push({
          property: key,
          direction: sort as any
        })

        if (aggregation) aggregations.push({
          property: key,
          aggregator: aggregation
        })

        if (filter) {
          filter.forEach((filter: any) => {
            const [operator, type, value] = filter;
            filters.push({
              property: key,
              filter: {
                operator,
                value: {
                  type,
                  value
                }
              } as any
            })
          })
        }
        properties.push(property)
      }
    }

    await this.saveTransactions([this.updateOp([], {
      query2: {
        sort: sorts,
        filter: {
          operator: "and",
          filters
        },
        aggregations
      },
      format: {
        [`${data.type}_properties`]: properties
      }
    })]);
    await this.updateCacheManually(this.id);
  }

  async createSort(cb: (T: TSchemaUnit & { key: string }) => [TSortValue, number] | undefined) {
    await this.createSorts(cb, false)
  }

  async createSorts(cb: (T: TSchemaUnit & { key: string }) => TSortValue | [TSortValue, number] | undefined, multiple?: boolean) {
    multiple = multiple ?? true;
    const data = this.getCachedData(), collection = this.cache.collection.get((this.cache.block.get(data.parent_id) as TCollectionBlock).collection_id) as ICollection;
    if (!data.query2) data.query2 = { sort: [] as ViewSorts[] } as any;
    if (!data.query2?.sort) (data.query2 as any).sort = [] as ViewSorts[];
    let total_created = 0;
    const sorts = data.query2?.sort as ViewSorts[];
    const schema_entries = Object.entries(collection.schema);
    for (let index = 0; index < schema_entries.length; index++) {
      const [key, schema] = schema_entries[index];
      const res = cb({ ...schema, key }) ?? undefined;
      if (res) {
        total_created++;
        if (Array.isArray(res)) {
          const [direction, position] = res;
          sorts.splice(position ?? sorts.length, 0, {
            property: key,
            direction
          })
        } else sorts.splice(sorts.length, 0, {
          property: key,
          direction: res
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
      await this.updateCacheManually(this.id);
    }
  }

  async updateSort(cb: (T: TSchemaUnit & ViewSorts) => [TSortValue, number] | undefined) {
    await this.updateSorts(cb, false);
  }

  async updateSorts(args: UpdateTypes<TSchemaUnit & ViewSorts, TSortValue | [TSortValue, number]>, execute?: boolean, multiple?: boolean) {
    const data = this.getCachedData(), collection = this.cache.collection.get((this.cache.block.get(data.parent_id) as TCollectionBlock).collection_id) as ICollection;

    if (!data.query2) data.query2 = { sort: [] } as any;
    if (data.query2 && !data.query2?.sort) data.query2.sort = [];

    const sorts_map: Record<string, TSchemaUnit & ViewSorts> = {}, sorts = data.query2?.sort as ViewSorts[];
    data.query2?.sort?.forEach(sort => {
      const schema_unit = collection.schema[sort.property];
      sorts_map[schema_unit.name] = {
        ...schema_unit,
        ...sort
      }
    })

    await this.updateIterate<TSchemaUnit & ViewSorts, TSortValue | [TSortValue, number]>(args, {
      child_ids: Object.keys(sorts_map),
      subject_type: "View",
      execute,
      multiple
    }, (id) => sorts_map[id], (_, sort, data, index) => {
      console.log(index);
      if (Array.isArray(data)) {
        const [direction, position] = data;
        if (position) {
          sorts.splice(index, 1)
          sorts.splice(position, 0, {
            property: sort.property,
            direction
          })
        }
      }
      else {
        const target_sort = sorts.find(data => data.property === sort.property) as ViewSorts;
        target_sort.direction = data
      }
    });
    await this.executeUtil([this.updateOp([], { query2: data.query2 })], this.id, execute)
  }

  async deleteSort(cb: (T: TSchemaUnit & ViewSorts) => boolean | undefined) {
    await this.deleteSorts(cb, false);
  }

  async deleteSorts(cb: (T: TSchemaUnit & ViewSorts) => boolean | undefined, multiple?: boolean) {
    multiple = multiple ?? true;
    const data = this.getCachedData(), collection = this.cache.collection.get((this.cache.block.get(data.parent_id) as TCollectionBlock).collection_id) as ICollection;
    let total_deleted = 0;
    const sorts = data.query2?.sort as ViewSorts[];
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
      await this.updateCacheManually(this.id);
    }
  }

  #populateFilters = (data: any) => {
    if (!data.query2) data.query2 = { filter: { operator: "and", filters: [] } };
    if (!data.query2?.filter) data.query2.filter = { operator: "and", filters: [] };
    if (!data.query2?.filter.filters) data.query2.filter.filters = [];
  }

  async createFilter(cb: (T: TSchemaUnit & { key: string }) => UserViewFilterParams | undefined) {
    await this.createFilters(cb, false)
  }

  async createFilters(cb: (T: TSchemaUnit & { key: string }) => UserViewFilterParams | undefined, multiple?: boolean) {
    multiple = multiple ?? true;
    const data = this.getCachedData(), parent = this.cache.block.get(data.parent_id) as TCollectionBlock, collection = this.cache.collection.get(parent.collection_id) as ICollection;
    this.#populateFilters(data);
    let total_created = 0;

    const filters = data.query2?.filter.filters as TViewFilters[];
    const schema_entries = Object.entries(collection.schema);
    for (let index = 0; index < schema_entries.length; index++) {
      const [key, schema] = schema_entries[index];
      const res = cb({ ...schema, key }) ?? undefined;
      if (res) {
        total_created++;
        const [operator, type, value, position] = res;
        filters.splice(position ?? filters.length, 0, {
          property: key,
          filter: {
            operator,
            value: {
              type,
              value
            }
          } as any
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
      await this.updateCacheManually(this.id);
    }
  }

  async updateFilter(cb: (T: TSchemaUnit & TViewFilters) => UserViewFilterParams | undefined) {
    await this.updateFilters(cb, false);
  }

  async updateFilters(cb: (T: TSchemaUnit & TViewFilters) => UserViewFilterParams | undefined, multiple?: boolean) {
    multiple = multiple ?? true;
    const data = this.getCachedData(), collection = this.cache.collection.get((this.cache.block.get(data.parent_id) as TCollectionBlock).collection_id) as ICollection;
    this.#populateFilters(data);
    let total_updated = 0;
    const filters = data.query2?.filter.filters as TViewFilters[];
    const schema_entries = new Map(Object.entries(collection.schema));
    for (let index = 0; index < filters.length; index++) {
      const filter = filters[index], schema = schema_entries.get(filter.property), res = cb({ ...schema, ...filter } as any) ?? undefined;
      if (res) {
        total_updated++;
        const [operator, type, value, position] = res;
        const update_filter = {
          property: filter.property,
          filter: {
            operator,
            value: {
              type,
              value
            }
          } as any
        };
        if (position) {
          filters.splice(index, 1)
          filters.splice(position, 0, update_filter)
        }
        else filters[index] = update_filter;
      }
      if (!multiple && total_updated === 1) break;
    }

    if (total_updated) {
      await this.saveTransactions([this.updateOp([], {
        query2: {
          ...data.query2
        }
      })]);
      await this.updateCacheManually(this.id);
    }
  }

  async deleteFilter(cb: (T: TSchemaUnit & TViewFilters) => boolean | undefined) {
    await this.deleteFilters(cb, false);
  }

  async deleteFilters(cb: (T: TSchemaUnit & TViewFilters) => boolean | undefined, multiple?: boolean) {
    multiple = multiple ?? true;
    const data = this.getCachedData(), collection = this.cache.collection.get((this.cache.block.get(data.parent_id) as TCollectionBlock).collection_id) as ICollection;
    this.#populateFilters(data);
    let total_deleted = 0;
    const filters = data.query2?.filter.filters as TViewFilters[],
      schema_entries = new Map(Object.entries(collection.schema));

    for (let index = 0; index < filters.length; index++) {
      const filter = filters[index] as TViewFilters,
        schema = schema_entries.get(filter.property),
        should_delete = cb({ ...filter, ...schema } as any) ?? undefined;
      if (should_delete) {
        total_deleted++;
        filters.splice(index, 1)
      }
      if (!multiple && total_deleted === 1) break;
    }

    if (total_deleted) {
      await this.saveTransactions([this.updateOp([], {
        query2: {
          ...data.query2
        }
      })]);
      await this.updateCacheManually(this.id);
    }
  }

  async updateFormatProperty(cb: (T: TSchemaUnit & ViewFormatProperties) => Partial<[number, boolean, number]> | undefined) {
    await this.updateFormatProperties(cb, false);
  }

  async updateFormatProperties(cb: (T: TSchemaUnit & ViewFormatProperties) => Partial<[number, boolean, number]> | undefined, multiple?: boolean) {
    multiple = multiple ?? true;
    const data = this.getCachedData(), collection = this.cache.collection.get((this.cache.block.get(data.parent_id) as TCollectionBlock).collection_id) as ICollection;
    let total_effected = 0;
    const properties = (data.format as any)[`${data.type}_properties`] as ViewFormatProperties[], updated_properties = [] as ViewFormatProperties[];
    for (let index = 0; index < properties.length; index++) {
      const property = properties[index], collection_property = collection.schema[property.property];
      const updated_property = cb({ ...property, ...collection_property }),
        position = updated_property?.[2]
      const new_property = {
        width: updated_property?.[0] ?? property.width,
        property: property.property,
        visible: updated_property?.[1] ?? property.visible
      }
      const _index = position ?? index;
      updated_properties[_index] = new_property
      total_effected++;
      if (!multiple && total_effected === 1) break;
    }
    if (total_effected) {
      await this.saveTransactions([this.updateOp([], {
        format: {
          ...data.format,
          [`${data.type}_properties`]: updated_properties
        }
      })]);
      await this.updateCacheManually(this.id);
    }
  }
}

export default View;