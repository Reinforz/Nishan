import { Operation } from '@nishans/operations';
import { ICollection, TCollectionBlock, TView, TViewFilters, TViewUpdateInput } from '@nishans/types';
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
import {
  deepMerge,
  getFiltersMap,
  getFormatPropertiesMap,
  getSchemaMap,
  getSortsMap,
  initializeViewFilters,
  populateFilters,
  transformToMultiple,
  UnknownPropertyReferenceError
} from '../../utils';
import Data from '../Data';

/**
 * A class to represent view of Notion
 * @noInheritDoc
 */
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
		this.Operations.stack.push(
			Operation.collection_view.update(this.id, [], { ...updated_data, ...this.getLastEditedProps() })
		);
		this.updateLastEditedProps();
	}

	createSorts (args: TSortCreateInput[]) {
		const data = this.getCachedData(),
			collection = this.getCollection(),
			schema_map = getSchemaMap(collection.schema),
			[ sorts_map, sorts ] = getSortsMap(data, collection.schema);
		for (let index = 0; index < args.length; index++) {
			const arg = args[index],
				schema_map_unit = schema_map.get(arg[0]),
				target_sort = sorts_map.get(arg[0]);
			if (!schema_map_unit) throw new UnknownPropertyReferenceError(arg[0], [ '[0]' ]);
			else {
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
				} else throw new Error(`Property ${arg[0]} already has sort ${target_sort.sort}`);
			}
		}

		this.updateLastEditedProps();
		this.Operations.stack.push(
			Operation.collection_view.update(this.id, [ 'query2', 'sort' ], sorts)
		);
	}

	async updateSort (arg: UpdateType<ISchemaSortsMapValue, TSortUpdateInput>) {
		await this.updateSorts(transformToMultiple(arg), false);
	}

	async updateSorts (args: UpdateTypes<ISchemaSortsMapValue, TSortUpdateInput>, multiple?: boolean) {
		const data = this.getCachedData(),
			collection = this.getCollection(),
			[ sorts_map, sorts ] = getSortsMap(data, collection.schema);
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

		this.Operations.stack.push(
			Operation.collection_view.update(this.id, [ 'query2', 'sort' ], sorts)
		);
	}

	async deleteSort (arg: FilterType<ISchemaSortsMapValue>) {
		await this.deleteSorts(transformToMultiple(arg), false);
	}

	async deleteSorts (args: FilterTypes<ISchemaSortsMapValue>, multiple?: boolean) {
		const [ sorts_map, sorts ] = getSortsMap(this.getCachedData(), this.getCollection().schema);
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
		this.Operations.stack.push(
			Operation.collection_view.update(this.id, [ 'query2', 'sort' ], sorts)
		);
	}

	createFilters (args: TViewFilterCreateInput[]) {
		const schema_map = getSchemaMap(this.getCollection().schema),
			data = this.getCachedData(),
			filters = initializeViewFilters(data).filters;
		populateFilters(args, filters, schema_map);
		this.updateLastEditedProps();
		this.Operations.stack.push(
			Operation.collection_view.update(this.id, ['query2', 'filter'], (data.query2 as any).filter)
		);
	}

	async updateFilter (arg: UpdateType<ISchemaFiltersMapValue, TViewFilterUpdateInput>) {
		await this.updateFilters(transformToMultiple(arg), false);
	}

	async updateFilters (args: UpdateTypes<ISchemaFiltersMapValue, TViewFilterUpdateInput>, multiple?: boolean) {
		const data = this.getCachedData(), [ filters_map, { filters } ] = getFiltersMap(data, this.getCollection().schema);

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
			(_, original_filter, updated_data) => {
				const index = filters.findIndex((data) => (data as any).property === original_filter.schema_id),
					filter = filters[index] as TViewFilters,
					{ filter: _filter, position } = updated_data;

				filter.filter = _filter;
				if (position !== null && position !== undefined) {
					filters.splice(index, 1);
					filters.splice(position, 0, original_filter as any);
				}
			}
		);
		this.Operations.stack.push(
			Operation.collection_view.update(this.id, ['query2', 'filter'], (data.query2 as any).filter)
		);
	}

	async deleteFilter (arg: FilterType<ISchemaFiltersMapValue>) {
		await this.deleteFilters(transformToMultiple(arg));
	}

	async deleteFilters (args: FilterTypes<ISchemaFiltersMapValue>, multiple?: boolean) {
		const [ filters_map, { filters } ] = getFiltersMap(this.getCachedData(), this.getCollection().schema),
			data = this.getCachedData();
		await this.deleteIterate<ISchemaFiltersMapValue>(
			args,
			{
				child_type: 'collection_view',
				multiple,
				manual: true,
				container: [],
				child_ids: Array.from(filters_map.keys())
			},
			(schema_id) => filters_map.get(schema_id),
			(_, filter) => {
				filters.splice(filters.findIndex((data) => (data as any).property === filter.schema_id), 1);
			}
		);
		this.Operations.stack.push(
			Operation.collection_view.update(this.id, [], {
				query2: data.query2
			})
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
			[ format_properties_map, format_properties ] = getFormatPropertiesMap(data, this.getCollection().schema);
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
			(name, current_data, updated_data) => {
				const target_format_property_index = format_properties.findIndex(
						(format_property) => format_property.property === current_data.schema_id
					),
					target_format_property = format_properties[target_format_property_index];
				const { position, visible, width } = updated_data;

				if (target_format_property_index !== position && position !== undefined && position !== null) {
					format_properties.splice(target_format_property_index, 1);
					format_properties.splice(position, 0, target_format_property);
				}

				target_format_property.visible = visible ?? target_format_property.visible;
				target_format_property.width = width ?? target_format_property.width;
			}
		);
    
		this.Operations.stack.push(
			Operation.collection_view.update(this.id, [`format`, `${data.type}_properties`], format_properties)
		);
	}
}

export default View;
