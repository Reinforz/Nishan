import { PreExistentValueError } from "@nishans/errors";
import { generateSchemaMapFromCollectionSchema, ISchemaMap } from '@nishans/notion-formula';
import { Operation } from '@nishans/operations';
import { ICollection, TCollectionBlock, TView, TViewUpdateInput } from '@nishans/types';
import {
  deepMerge,
  getSchemaMapUnit,
  initializeViewFilters,
  populateFilters,
  PopulateViewMaps,
  transformToMultiple
} from '../../libs';
import {
  FilterType,
  FilterTypes,
  ISchemaFiltersMapValue,
  ISchemaFormatMapValue,
  ISchemaSortsMapValue,
  NishanArg,
  RepositionParams,
  SchemaFormatPropertiesUpdateInput,
  TSortCreateInput,
  TSortUpdateInput,
  TViewFilterCreateInput,
  TViewFilterUpdateInput,
  UpdateType,
  UpdateTypes
} from '../../types';
import Data from '../Data';

/**
 * A class to represent view of Notion
 * @noInheritDoc
 */

export function setPropertyFromName(name: string, schema_map: ISchemaMap, data: {property: string}){
  data.property = getSchemaMapUnit(schema_map, name, ['name']).schema_id;
}

class View<T extends TView> extends Data<T> {
	constructor (arg: NishanArg) {
		super({ ...arg, type: 'collection_view' });
	}

	getCollection = () => {
		return this.cache.collection.get(
			(this.cache.block.get(this.getCachedData().parent_id) as TCollectionBlock).collection_id
		) as ICollection;
	};

	getCachedParentData () {
		return this.cache.block.get(this.getCachedData().parent_id) as TCollectionBlock;
	}

	reposition (arg: RepositionParams) {
		this.addToChildArray('block', this.getCachedParentData(), arg);
	}

	/**
   * Update the current view
   * @param options Options to update the view
   */

	update (updated_data: TViewUpdateInput) {
		const view_data = this.getCachedData();
		deepMerge(view_data, updated_data);
		this.Operations.pushToStack(
			Operation.collection_view.update(this.id, [], { ...updated_data, ...this.getLastEditedProps() })
		);
		this.updateLastEditedProps();
	}

	createSorts (args: TSortCreateInput[]) {
		const data = this.getCachedData(),
			collection = this.getCollection(),
			schema_map = generateSchemaMapFromCollectionSchema(collection.schema),
			[ sorts_map, sorts ] = PopulateViewMaps.sorts(data, collection.schema);
		for (let index = 0; index < args.length; index++) {
			const arg = args[index],
				schema_map_unit = getSchemaMapUnit(schema_map, arg[0],  [ `${index}` ]),
				target_sort = sorts_map.get(arg[0]);
				if (!target_sort) {
					if (typeof arg[2] === 'number') {
						sorts.splice(arg[2], 0, {
							property: schema_map_unit.schema_id,
							direction: arg[1]
						});
					} else
						sorts.push({
							property: schema_map_unit.schema_id,
							direction: arg[1]
						});
				} else throw new PreExistentValueError('sort', arg[0], target_sort.sort);
		}

		this.updateLastEditedProps();
		this.Operations.pushToStack(
			Operation.collection_view.update(this.id, [ 'query2', 'sort' ], sorts)
		);
	}

	async updateSort (arg: UpdateType<ISchemaSortsMapValue, TSortUpdateInput>) {
		await this.updateSorts(transformToMultiple(arg), false);
	}

	async updateSorts (args: UpdateTypes<ISchemaSortsMapValue, TSortUpdateInput>, multiple?: boolean) {
		const data = this.getCachedData(),
			collection = this.getCollection(),
			[ sorts_map, sorts ] = PopulateViewMaps.sorts(data, collection.schema);
		await this.updateIterate<ISchemaSortsMapValue, TSortUpdateInput>(
			args,
			{
				child_ids: Array.from(sorts_map.keys()),
				child_type: 'collection_view',
				multiple,
				manual: true,
				container: [],
        initialize_cache: false
			},
			(schema_id) => sorts_map.get(schema_id),
			(_, sort, update_input) => {
				const index = sorts.findIndex((data) => data.property === sort.schema_id);
				if (Array.isArray(update_input)) {
					const [ direction, position ] = update_input;
					sorts.splice(index, 1);
					sorts.splice(position, 0, {
						property: sort.schema_id,
						direction
					});
				} else if (typeof update_input === 'string') sorts[index].direction = update_input;
				else {
					const sort = sorts[index];
					sorts.splice(index, 1);
					sorts.splice(update_input, 0, sort);
				}
			}
		);

		this.Operations.pushToStack(
			Operation.collection_view.update(this.id, [ 'query2', 'sort' ], sorts)
		);
	}

	async deleteSort (arg: FilterType<ISchemaSortsMapValue>) {
		await this.deleteSorts(transformToMultiple(arg), false);
	}

	async deleteSorts (args: FilterTypes<ISchemaSortsMapValue>, multiple?: boolean) {
		const [ sorts_map, sorts ] = PopulateViewMaps.sorts(this.getCachedData(), this.getCollection().schema);
		await this.deleteIterate<ISchemaSortsMapValue>(
			args,
			{
				child_ids: Array.from(sorts_map.keys()),
				child_type: 'collection_view',
				multiple,
				manual: true,
				container: [],
        initialize_cache: false
			},
			(schema_id) => sorts_map.get(schema_id),
			(_, sort) => {
				sorts.splice(sorts.findIndex((data) => data.property === sort.schema_id), 1);
			}
		);
		this.Operations.pushToStack(
			Operation.collection_view.update(this.id, [ 'query2', 'sort' ], sorts)
		);
	}

	createFilters (args: TViewFilterCreateInput[]) {
		const schema_map = generateSchemaMapFromCollectionSchema(this.getCollection().schema),
			data = this.getCachedData(),
			filters = initializeViewFilters(data).filters;
		populateFilters(args, filters, schema_map);
		this.updateLastEditedProps();
		this.Operations.pushToStack(
			Operation.collection_view.update(this.id, ['query2', 'filter'], (data.query2 as any).filter)
		);
	}

	async updateFilter (arg: UpdateType<ISchemaFiltersMapValue, TViewFilterUpdateInput>) {
		await this.updateFilters(transformToMultiple(arg), false);
	}

	async updateFilters (args: UpdateTypes<ISchemaFiltersMapValue, TViewFilterUpdateInput>, multiple?: boolean) {
		const data = this.getCachedData(), 
      {schema} = this.getCollection(), 
      schema_map = generateSchemaMapFromCollectionSchema(schema), 
      [ filters_map ] = PopulateViewMaps.filters(data, schema);
    
		await this.updateIterate<ISchemaFiltersMapValue, TViewFilterUpdateInput>(
			args,
			{
				child_ids: Array.from(filters_map.keys()),
				child_type: 'collection_view',
				multiple,
				manual: true,
				container: [],
        initialize_cache: false
			},
			(schema_id) => filters_map.get(schema_id),
			(_, {child_filter, parent_filter}, updated_data) => {
				const filter_index = parent_filter.filters.findIndex((filter) => filter === child_filter), {filters} = parent_filter,
					{ filter: updated_filter, position, name } = updated_data;
          
        if(name)
          setPropertyFromName(name, schema_map, child_filter)

				deepMerge(child_filter.filter, updated_filter);

				if (position !== null && position !== undefined) {
					filters.splice(filter_index, 1);
					filters.splice(position, 0, child_filter as any);
				}
			}
		);
    
		this.Operations.pushToStack(
			Operation.collection_view.update(this.id, ['query2', 'filter'], (data.query2 as any).filter)
		);
	}

	async deleteFilter (arg: FilterType<ISchemaFiltersMapValue>) {
		await this.deleteFilters(transformToMultiple(arg));
	}

	async deleteFilters (args: FilterTypes<ISchemaFiltersMapValue>, multiple?: boolean) {
    const data = this.getCachedData(), 
      {schema} = this.getCollection(), 
      [ filters_map ] = PopulateViewMaps.filters(data, schema);

		await this.deleteIterate<ISchemaFiltersMapValue>(
			args,
			{
				child_type: 'collection_view',
				multiple,
				manual: true,
				container: [],
				child_ids: Array.from(filters_map.keys()),
        initialize_cache: false
			},
			(schema_id) => filters_map.get(schema_id),
			(_, {child_filter, parent_filter}) => {
        parent_filter.filters.splice(parent_filter.filters.findIndex((filter) => filter === child_filter),1);
			}
		);
    
		this.Operations.pushToStack(
			Operation.collection_view.update(this.id, ['query2', 'filter'], (data.query2 as any).filter)
		);
	}

	async updateFormatProperty (arg: UpdateType<ISchemaFormatMapValue, SchemaFormatPropertiesUpdateInput>) {
		await this.updateFormatProperties(transformToMultiple(arg), false);
	}

	async updateFormatProperties (
		args: UpdateTypes<ISchemaFormatMapValue, SchemaFormatPropertiesUpdateInput>,
		multiple?: boolean
	) {
		const data = this.getCachedData(),
			[ format_properties_map, format_properties ] = PopulateViewMaps.properties(data, this.getCollection().schema);
		await this.updateIterate<ISchemaFormatMapValue, SchemaFormatPropertiesUpdateInput>(
			args,
			{
				child_type: 'collection_view',
				multiple,
				child_ids: Array.from(format_properties_map.keys()),
				manual: true,
				container: [],
        initialize_cache: false
			},
			(name) => format_properties_map.get(name),
			(_, current_data, updated_data) => {
				const target_format_property_index = format_properties.findIndex(
						(format_property) => format_property.property === current_data.schema_id
					),
					target_format_property = format_properties[target_format_property_index];
				const { position, visible } = updated_data;

				if (target_format_property_index !== position && position !== undefined && position !== null) {
					format_properties.splice(target_format_property_index, 1);
					format_properties.splice(position, 0, target_format_property);
				}

				target_format_property.visible = visible ?? target_format_property.visible;
        if(updated_data.type === "table")
				  (target_format_property as any).width = updated_data.width ?? (target_format_property as any).width;
			}
		);
    
		this.Operations.pushToStack(
			Operation.collection_view.update(this.id, [`format`, `${data.type}_properties`], format_properties)
		);
	}
}

export default View;
