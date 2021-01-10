import { TView, TCollectionBlock, ICollection, TSchemaUnit, TViewFilters, ViewSorts, ViewFormatProperties, ICollectionBlock, TSortValue } from "@nishans/types";
import { NishanArg, RepositionParams,  UpdateType, UpdateTypes, FilterTypes, FilterType, TViewCreateInput, TViewFilterCreateInput } from "../../types";
import { createViews, initializeViewFilters, initializeViewSorts, Operation, populateFilters } from "../../utils";
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

  // ! FIX:1:H Make better filter coagulation using filters property that contains an array of root filters for the name
  #getFiltersMap = () => {
    const data = this.getCachedData(), collection = this.#getCollection(), filters = initializeViewFilters(this.getCachedData()),
      filters_map: Record<string, TSchemaUnit & TViewFilters> = {};

    data.query2?.filter.filters.forEach(filter => {
      if((filter as TViewFilters).property){
        const schema_unit = collection.schema[(filter as TViewFilters).property];
        filters_map[schema_unit.name] = {
          ...schema_unit,
          ...filter
        } as any
      }
    })
    return [filters_map, filters] as const;
  }

  #getSortsMap = () => {
    const data = this.getCachedData(), collection = this.#getCollection(),
      sorts_map: Record<string, TSchemaUnit & ViewSorts> = {}, sorts = initializeViewSorts(this.getCachedData());
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
    const collection = this.#getCollection(), schema_map: Map<string, TSchemaUnit & { property: string }> = new Map();
    Object.entries(collection.schema).forEach(([property, value]) => {
      schema_map.set(value.name, {
        property,
        ...value
      })
    })
    return schema_map;
  }

  getCachedParentData() {
    return this.cache.block.get(this.getCachedData().parent_id) as TCollectionBlock;
  }

  async reposition(arg: RepositionParams) {
    await this.saveTransactions([this.addToChildArray(this.id, arg)]);
  }

  /**
   * Update the current view
   * @param options Options to update the view
   */

  update(param: TViewCreateInput, ) {
    const data = this.getCachedData(), collection = this.cache.collection.get((this.cache.block.get(data.parent_id) as ICollectionBlock).collection_id) as ICollection, [created_view_ops, view_map] = createViews(collection.schema, [param], collection.id, data.parent_id, this.getProps(), this.id);
    this.stack.push(...created_view_ops);
    this.updateLastEditedProps();
    return view_map;
  }

  async createSort(arg: ([string, TSortValue, number] | [string, TSortValue]), ) {
    await this.createSorts([arg], )
  }

  createSorts(args: ([string, TSortValue, number] | [string, TSortValue])[], ) {
    const data = this.getCachedData(), schema_map = this.#getSchemaMap(), [, sorts] = this.#getSortsMap();
    for (let index = 0; index < args.length; index++) {
      const arg = args[index], target_sort = schema_map.get(arg[0]);
      if(target_sort){
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
    }
    this.updateLastEditedProps();
    this.stack.push(Operation.collection_view.update(this.id,[], {
      query2: data.query2
    }))
  }

  async updateSort(arg: UpdateType<TSchemaUnit & ViewSorts, TSortValue | [TSortValue, number]>,) {
    await this.updateSorts(typeof arg === "function" ? arg : [arg],  false);
  }

  async updateSorts(args: UpdateTypes<TSchemaUnit & ViewSorts, TSortValue | [TSortValue, number]>, multiple?: boolean) {
    const data = this.getCachedData(), [sorts_map, sorts] = this.#getSortsMap()
    await this.updateIterate<TSchemaUnit & ViewSorts, TSortValue | [TSortValue, number]>(args, {
      child_ids: Object.keys(sorts_map),
      subject_type: "View",
      
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
    this.updateLastEditedProps();
    this.stack.push(Operation.collection_view.update(this.id,[], { query2: data.query2 }))
  }

  async deleteSort(arg: FilterTypes<TSchemaUnit & ViewSorts>,) {
    await this.deleteSorts(typeof arg === "string" ? [arg] : arg,  false);
  }

  async deleteSorts(args: FilterTypes<TSchemaUnit & ViewSorts>, multiple?: boolean) {
    const data = this.getCachedData(), [sorts_map, sorts] = this.#getSortsMap();
    await this.getIterate<TSchemaUnit & ViewSorts>(args, {
      child_ids: Object.keys(sorts_map),
      subject_type: "View",
      multiple,
      method: "DELETE"
    }, (id) => sorts_map[id], (_, sort) => {
      sorts.splice(sorts.findIndex(data => data.property === sort.property), 1);
    });
    this.updateLastEditedProps();
    this.stack.push(Operation.collection_view.update(this.id,[], { query2: data.query2 }))
  }

  createFilters(args: TViewFilterCreateInput[], ) {
    const schema_map = this.#getSchemaMap(), data = this.getCachedData(), filters = initializeViewFilters(this.getCachedData()).filters;
    populateFilters(args, filters, schema_map)
    this.updateLastEditedProps();
    this.stack.push(Operation.collection_view.update(this.id,[], {
      query2: data.query2
    }))
  }

  async updateFilter(arg: UpdateType<TSchemaUnit & TViewFilters, Omit<TViewFilterCreateInput, "name">>, ) {
    await this.updateFilters(typeof arg === "function" ? arg : [arg],  false);
  }

  async updateFilters(args: UpdateTypes<TSchemaUnit & TViewFilters, Omit<TViewFilterCreateInput, "name">>, multiple?: boolean) {
    const [filters_map, { filters }] = this.#getFiltersMap(), data = this.getCachedData();

    await this.updateIterate<TSchemaUnit & TViewFilters, Omit<TViewFilterCreateInput, "name">>(args, {
      child_ids: Object.keys(filters_map),
      subject_type: "View",
      
      multiple
    }, (name) => filters_map[name], (_, original_filter, updated_data) => {
      const index = filters.findIndex(data => (data as any).property === original_filter.property), filter = filters[index] as TViewFilters,
        { filter:_filter, position, } = updated_data;

      filter.filter = _filter
      if (position !== null && position !== undefined) {
        filters.splice(index, 1);
        filters.splice(position, 0, original_filter)
      }
    });
    this.updateLastEditedProps();

    this.stack.push(Operation.collection_view.update(this.id,[], {
      query2: data.query2
    }))
  }

  async deleteFilter(arg: FilterType<TSchemaUnit & TViewFilters>, ) {
    await this.deleteFilters(typeof arg === "string" ? [arg] : arg, );
  }

  async deleteFilters(args: FilterTypes<TSchemaUnit & TViewFilters>, multiple?: boolean) {
    const [filters_map, { filters }] = this.#getFiltersMap(), data = this.getCachedData();
    await this.getIterate<TSchemaUnit & TViewFilters>(args, {
      subject_type: "View",
      method: "DELETE",
      multiple,
      child_ids: Object.keys(filters_map),
    }, (name) => filters_map[name], (_, filter) => {
      filters.splice(filters.findIndex(data => (data as any).property === filter.property))
    });
    this.updateLastEditedProps();

    this.stack.push(Operation.collection_view.update(this.id,[], {
      query2: data.query2
    }))
  }

  async updateFormatVisibilityProperty(arg: UpdateType<TSchemaUnit & ViewFormatProperties, boolean>, ) {
    return await this.updateFormatVisibilityProperties(typeof arg === "function" ? arg : [arg],  false);
  }

  async updateFormatVisibilityProperties(args: UpdateTypes<TSchemaUnit & ViewFormatProperties, boolean>, multiple?: boolean) {
    const [data, format_properties_map, format_properties] = this.#getFormatPropertiesMap();
    await this.updateIterate<TSchemaUnit & ViewFormatProperties, boolean>(args, {
      subject_type: "View",
      multiple,
      child_ids: Object.keys(format_properties_map),
      
    }, (name) => format_properties_map[name], (name, current_data, updated_data) => {
      const target_format_property = format_properties.find(format_property => format_property.property === current_data.property) as ViewFormatProperties;
      target_format_property.visible = updated_data;
    });
    this.updateLastEditedProps();

    this.stack.push(Operation.collection_view.update(this.id,[], {
      format: data.format,
    }))
  }

  async updateFormatWidthProperty(arg: UpdateType<TSchemaUnit & ViewFormatProperties, number>, ) {
    return await this.updateFormatWidthProperties(typeof arg === "function" ? arg : [arg],  false);
  }

  async updateFormatWidthProperties(args: UpdateTypes<TSchemaUnit & ViewFormatProperties, number>, multiple?: boolean) {
    const [data, format_properties_map, format_properties] = this.#getFormatPropertiesMap();
    await this.updateIterate<TSchemaUnit & ViewFormatProperties, number>(args, {
      subject_type: "View",
      multiple,
      child_ids: Object.keys(format_properties_map),
      
    }, (name) => format_properties_map[name], (name, current_data, updated_data) => {
      const target_format_property = format_properties.find(format_property => format_property.property === current_data.property) as ViewFormatProperties;
      target_format_property.width = updated_data;
    });
    this.updateLastEditedProps();

    this.stack.push(Operation.collection_view.update(this.id,[], {
      format: data.format,
    }))
  }

  async updateFormatPositionProperty(arg: UpdateType<TSchemaUnit & ViewFormatProperties, number>, ) {
    return await this.updateFormatPositionProperties(typeof arg === "function" ? arg : [arg],  false);
  }

  async updateFormatPositionProperties(args: UpdateTypes<TSchemaUnit & ViewFormatProperties, number>, multiple?: boolean) {
    const [data, format_properties_map, format_properties] = this.#getFormatPropertiesMap();
    await this.updateIterate<TSchemaUnit & ViewFormatProperties, number>(args, {
      subject_type: "View",
      multiple,
      child_ids: Object.keys(format_properties_map),
      
    }, (name) => format_properties_map[name], (name, current_data, new_position) => {
      const target_format_property_index = format_properties.findIndex(format_property => format_property.property === current_data.property), target_format_property = format_properties[target_format_property_index];
      if (target_format_property_index !== new_position) {
        format_properties.splice(target_format_property_index, 1);
        format_properties.splice(new_position, 0, target_format_property)
      }
    });
    this.updateLastEditedProps();

    this.stack.push(Operation.collection_view.update(this.id,[], {
      format: data.format,
    }))
  }

  async updateFormatProperty(arg: UpdateType<TSchemaUnit & ViewFormatProperties, Partial<{ position: number, visible: boolean, width: number }>>, ) {
    await this.updateFormatProperties(typeof arg === "function" ? arg : [arg],  false);
  }

  async updateFormatProperties(args: UpdateTypes<TSchemaUnit & ViewFormatProperties, Partial<{ position: number, visible: boolean, width: number }>>, multiple?: boolean) {
    const [data, format_properties_map, format_properties] = this.#getFormatPropertiesMap();
    await this.updateIterate<TSchemaUnit & ViewFormatProperties, Partial<{ position: number, visible: boolean, width: number }>>(args, {
      subject_type: "View",
      multiple,
      child_ids: Object.keys(format_properties_map),
      
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
    this.updateLastEditedProps();

    this.stack.push(Operation.collection_view.update(this.id,[], {
      format: data.format,
    }))
  }
}

export default View;