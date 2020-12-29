import { RepositionParams, ICollection, ISchemaUnit, NishanArg, TCollectionBlock, TView, ViewAggregations, ViewFormatProperties, TSchemaUnit, TSortValue, ViewSorts, TViewFilters, ViewUpdateParam, UpdateTypes, FilterTypes, TViewQuery2, IViewFilter, UserViewFilterCreateParams, FilterType, UpdateType } from "../../types";
import Data from "../Data";

/**
 * A class to represent view of Notion
 * @noInheritDoc
 */
class View<T extends TView> extends Data<T> {
  constructor(arg: NishanArg) {
    super({ ...arg, type: "collection_view" });
  }

  #getCollection = () => {
    return this.cache.collection.get((this.cache.block.get(this.getCachedData().parent_id) as TCollectionBlock).collection_id) as ICollection
  }

  #getFiltersMap = () => {
    const data = this.getCachedData(), collection = this.#getCollection(), filters = this.#populateFilters(),
      filters_map: Record<string, TSchemaUnit & TViewFilters> = {};

    data.query2?.filter.filters.forEach(filter => {
      const schema_unit = collection.schema[filter.property];
      filters_map[schema_unit.name] = {
        ...schema_unit,
        ...filter
      }
    })
    return [filters_map, filters] as const;
  }

  #getSortsMap = () => {
    const data = this.getCachedData(), collection = this.#getCollection(),
      sorts_map: Record<string, TSchemaUnit & ViewSorts> = {}, sorts = this.#populateSorts();
    data.query2?.sort?.forEach(sort => {
      const schema_unit = collection.schema[sort.property];
      sorts_map[schema_unit.name] = {
        ...schema_unit,
        ...sort
      }
    });

    return [sorts_map, sorts] as const;
  }

  #getFormatProperties = () => {
    const data = this.getCachedData();
    return [data, (data.format as any)[`${data.type}_properties`] as ViewFormatProperties[]] as const;
  }

  #getFormatPropertiesMap = () => {
    const collection = this.#getCollection(), format_map: Record<string, TSchemaUnit & ViewFormatProperties> = {}, [data, format_properties] = this.#getFormatProperties();
    format_properties.forEach(format_property => {
      const schema_unit = collection.schema[format_property.property];
      format_map[schema_unit.name] = {
        ...schema_unit,
        ...format_property
      }
    })
    return [data, format_map, format_properties] as const;
  }

  #getSchemaMap = () => {
    const collection = this.#getCollection(), schema_map: Record<string, TSchemaUnit & { property: string }> = {};
    Object.entries(collection.schema).forEach(([property, value]) => {
      schema_map[value.name] = {
        property,
        ...value
      }
    })
    return schema_map;
  }

  #populateFilters = () => {
    const data = this.getCachedData();
    if (!data.query2) data.query2 = { filter: { operator: "and", filters: [] } } as any;
    if (!data.query2?.filter) (data.query2 as TViewQuery2).filter = { operator: "and", filters: [] };
    if (!data.query2?.filter.filters) (data.query2 as TViewQuery2).filter.filters = [];
    return (data.query2 as any).filter as IViewFilter
  }

  #populateSorts = () => {
    const data = this.getCachedData();
    if (!data.query2) data.query2 = { sort: [] } as any;
    if (data.query2 && !data.query2?.sort) data.query2.sort = [];
    return (data.query2 as any).sort as ViewSorts[]
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
      const { name, format, sort, aggregation, filters: _filters } = options[index];
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

        if (_filters) {
          _filters.forEach((filter: any) => {
            const [operator, type, value] = filter;
            filters.push({
              property: key,
              filter: {
                operator,
                value: {
                  type,
                  value
                }
              }
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

  async createSort(arg: ([string, TSortValue, number] | [string, TSortValue]), execute?: boolean) {
    await this.createSorts([arg], execute)
  }

  async createSorts(args: ([string, TSortValue, number] | [string, TSortValue])[], execute?: boolean) {
    const data = this.getCachedData(), schema_map = this.#getSchemaMap(), [, sorts] = this.#getSortsMap();
    for (let index = 0; index < args.length; index++) {
      const arg = args[index], target_sort = schema_map[arg[0]];
      if (typeof arg[2] === "number") {
        sorts.splice(arg[2], 0, {
          property: target_sort.property,
          direction: arg[1]
        })
      } else
        sorts.push({
          property: target_sort.property,
          direction: arg[1]
        })
    }

    await this.executeUtil([this.updateOp([], {
      query2: {
        ...data.query2
      }
    })], this.id, execute)
  }

  async updateSort(arg: UpdateType<TSchemaUnit & ViewSorts, TSortValue | [TSortValue, number]>, execute?: boolean,) {
    await this.updateSorts(typeof arg === "function" ? arg : [arg], execute, false);
  }

  async updateSorts(args: UpdateTypes<TSchemaUnit & ViewSorts, TSortValue | [TSortValue, number]>, execute?: boolean, multiple?: boolean) {
    const data = this.getCachedData(), [sorts_map, sorts] = this.#getSortsMap()
    await this.updateIterate<TSchemaUnit & ViewSorts, TSortValue | [TSortValue, number]>(args, {
      child_ids: Object.keys(sorts_map),
      subject_type: "View",
      execute,
      multiple
    }, (id) => sorts_map[id], (_, sort, data) => {
      if (Array.isArray(data)) {
        const index = sorts.findIndex(data => data.property === sort.property);
        const [direction, position] = data;
        if (position !== null && position !== undefined) {
          sorts.splice(index, 1);
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

  async deleteSort(arg: FilterTypes<TSchemaUnit & ViewSorts>, execute?: boolean,) {
    await this.deleteSorts(typeof arg === "string" ? [arg] : arg, execute, false);
  }

  async deleteSorts(args: FilterTypes<TSchemaUnit & ViewSorts>, execute?: boolean, multiple?: boolean) {
    const data = this.getCachedData(), [sorts_map, sorts] = this.#getSortsMap();
    await this.getIterate<TSchemaUnit & ViewSorts>(args, {
      child_ids: Object.keys(sorts_map),
      subject_type: "View",
      multiple,
      method: "DELETE"
    }, (id) => sorts_map[id], (_, sort) => {
      sorts.splice(sorts.findIndex(data => data.property === sort.property), 1);
    });
    await this.executeUtil([this.updateOp([], { query2: data.query2 })], this.id, execute)
  }

  async createFilter(arg: UserViewFilterCreateParams, execute?: boolean) {
    await this.createFilters([arg], execute)
  }

  async createFilters(args: UserViewFilterCreateParams[], execute?: boolean) {
    const schema_map = this.#getSchemaMap(), data = this.getCachedData(), filters = this.#populateFilters().filters;
    for (let index = 0; index < args.length; index++) {
      const { type, operator, value, name, position } = args[index];
      const filter = {
        property: schema_map[name].property,
        filter: {
          operator,
          value: {
            type,
            value
          }
        }
      };
      if (position !== undefined)
        filters.splice(position, 0, filter as any)
      else filters.push(filter as any)
    }
    await this.executeUtil([this.updateOp([], {
      query2: data.query2
    })], this.id, execute)
  }

  async updateFilter(arg: UpdateType<TSchemaUnit & TViewFilters, Omit<UserViewFilterCreateParams, "name">>, execute?: boolean) {
    await this.updateFilters(typeof arg === "function" ? arg : [arg], execute, false);
  }

  async updateFilters(args: UpdateTypes<TSchemaUnit & TViewFilters, Omit<UserViewFilterCreateParams, "name">>, execute?: boolean, multiple?: boolean) {
    const [filters_map, { filters }] = this.#getFiltersMap(), data = this.getCachedData();

    await this.updateIterate<TSchemaUnit & TViewFilters, Omit<UserViewFilterCreateParams, "name">>(args, {
      child_ids: Object.keys(filters_map),
      subject_type: "View",
      execute,
      multiple
    }, (name) => filters_map[name], (_, original_filter, updated_data) => {
      const index = filters.findIndex(data => (data as any).property === original_filter.property), filter = filters[index] as TViewFilters,
        { type, operator, position, value } = updated_data;

      (filter.filter as any).operator = operator;
      (filter.filter as any).value = {
        type,
        value
      };
      if (position !== null && position !== undefined) {
        filters.splice(index, 1);
        filters.splice(position, 0, original_filter)
      }
    });

    await this.executeUtil([this.updateOp([], {
      query2: data.query2
    })], this.id, execute)
  }

  async deleteFilter(arg: FilterType<TSchemaUnit & TViewFilters>, execute?: boolean) {
    await this.deleteFilters(typeof arg === "string" ? [arg] : arg, execute);
  }

  async deleteFilters(args: FilterTypes<TSchemaUnit & TViewFilters>, execute?: boolean, multiple?: boolean) {
    const [filters_map, { filters }] = this.#getFiltersMap(), data = this.getCachedData();
    await this.getIterate<TSchemaUnit & TViewFilters>(args, {
      subject_type: "View",
      method: "DELETE",
      multiple,
      child_ids: Object.keys(filters_map),
    }, (name) => filters_map[name], (_, filter) => {
      filters.splice(filters.findIndex(data => (data as any).property === filter.property))
    });

    await this.executeUtil([this.updateOp([], {
      query2: data.query2
    })], this.id, execute)
  }

  async updateFormatVisibilityProperty(arg: UpdateType<TSchemaUnit & ViewFormatProperties, boolean>, execute?: boolean) {
    return await this.updateFormatVisibilityProperties(typeof arg === "function" ? arg : [arg], execute, false);
  }

  async updateFormatVisibilityProperties(args: UpdateTypes<TSchemaUnit & ViewFormatProperties, boolean>, execute?: boolean, multiple?: boolean) {
    const [data, format_properties_map, format_properties] = this.#getFormatPropertiesMap();
    await this.updateIterate<TSchemaUnit & ViewFormatProperties, boolean>(args, {
      subject_type: "View",
      multiple,
      child_ids: Object.keys(format_properties_map),
      execute
    }, (name) => format_properties_map[name], (name, current_data, updated_data) => {
      const target_format_property = format_properties.find(format_property => format_property.property === current_data.property) as ViewFormatProperties;
      target_format_property.visible = updated_data;
    });

    await this.executeUtil([this.updateOp([], {
      format: data.format,
    })], this.id, execute)
  }

  async updateFormatWidthProperty(arg: UpdateType<TSchemaUnit & ViewFormatProperties, number>, execute?: boolean) {
    return await this.updateFormatWidthProperties(typeof arg === "function" ? arg : [arg], execute, false);
  }

  async updateFormatWidthProperties(args: UpdateTypes<TSchemaUnit & ViewFormatProperties, number>, execute?: boolean, multiple?: boolean) {
    const [data, format_properties_map, format_properties] = this.#getFormatPropertiesMap();
    await this.updateIterate<TSchemaUnit & ViewFormatProperties, number>(args, {
      subject_type: "View",
      multiple,
      child_ids: Object.keys(format_properties_map),
      execute
    }, (name) => format_properties_map[name], (name, current_data, updated_data) => {
      const target_format_property = format_properties.find(format_property => format_property.property === current_data.property) as ViewFormatProperties;
      target_format_property.width = updated_data;
    });

    await this.executeUtil([this.updateOp([], {
      format: data.format,
    })], this.id, execute)
  }

  async updateFormatPositionProperty(arg: UpdateType<TSchemaUnit & ViewFormatProperties, number>, execute?: boolean) {
    return await this.updateFormatPositionProperties(typeof arg === "function" ? arg : [arg], execute, false);
  }

  async updateFormatPositionProperties(args: UpdateTypes<TSchemaUnit & ViewFormatProperties, number>, execute?: boolean, multiple?: boolean) {
    const [data, format_properties_map, format_properties] = this.#getFormatPropertiesMap();
    await this.updateIterate<TSchemaUnit & ViewFormatProperties, number>(args, {
      subject_type: "View",
      multiple,
      child_ids: Object.keys(format_properties_map),
      execute
    }, (name) => format_properties_map[name], (name, current_data, new_position) => {
      const target_format_property_index = format_properties.findIndex(format_property => format_property.property === current_data.property), target_format_property = format_properties[target_format_property_index];
      if (target_format_property_index !== new_position) {
        format_properties.splice(target_format_property_index, 1);
        format_properties.splice(new_position, 0, target_format_property)
      }
    });

    await this.executeUtil([this.updateOp([], {
      format: data.format,
    })], this.id, execute)
  }

  async updateFormatProperty(arg: UpdateType<TSchemaUnit & ViewFormatProperties, Partial<{ position: number, visible: boolean, width: number }>>, execute?: boolean) {
    await this.updateFormatProperties(typeof arg === "function" ? arg : [arg], execute, false);
  }

  async updateFormatProperties(args: UpdateTypes<TSchemaUnit & ViewFormatProperties, Partial<{ position: number, visible: boolean, width: number }>>, execute?: boolean, multiple?: boolean) {
    const [data, format_properties_map, format_properties] = this.#getFormatPropertiesMap();
    await this.updateIterate<TSchemaUnit & ViewFormatProperties, Partial<{ position: number, visible: boolean, width: number }>>(args, {
      subject_type: "View",
      multiple,
      child_ids: Object.keys(format_properties_map),
      execute
    }, (name) => format_properties_map[name], (name, current_data, updated_data) => {
      const target_format_property_index = format_properties.findIndex(format_property => format_property.property === current_data.property), target_format_property = format_properties[target_format_property_index];
      const { position, visible, width } = updated_data;
      if (target_format_property_index !== position && position !== undefined && position !== null) {
        format_properties.splice(target_format_property_index, 1);
        format_properties.splice(position, 0, target_format_property)
      }
      if (visible !== undefined && visible !== null) target_format_property.visible = visible;
      if (width !== undefined && width !== null) target_format_property.width = width;
    });

    await this.executeUtil([this.updateOp([], {
      format: data.format,
    })], this.id, execute)
  }
}

export default View;