import {
	TView,
	TCollectionBlock,
	ICollection,
	TViewFilters,
	ViewSorts,
	ViewFormatProperties,
	ICollectionBlock
} from '@nishans/types';
import {
	NishanArg,
	RepositionParams,
	UpdateType,
	UpdateTypes,
	FilterTypes,
	FilterType,
	TViewCreateInput,
	TViewFilterCreateInput,
	ISchemaSortsMapValue,
	ISchemaFiltersMapValue,
	ISchemaFormatMapValue,
	TSortCreateInput,
	TSortUpdateInput,
	TViewFilterUpdateInput,
	SchemaFormalPropertiesUpdateInput
} from '../../types';
import {
	createViews,
	getFiltersMap,
	getFormatPropertiesMap,
	getSchemaMap,
	getSortsMap,
	initializeViewFilters,
	Operation,
	populateFilters
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

	protected getCollection = () => {
		return this.cache.collection.get(
			(this.cache.block.get(this.getCachedData().parent_id) as TCollectionBlock).collection_id
		) as ICollection;
	};

	getCachedParentData () {
		return this.cache.block.get(this.getCachedData().parent_id) as TCollectionBlock;
	}

	reposition (arg: RepositionParams) {
		this.addToChildArray(this.getCachedParentData(), arg);
	}

	/**
   * Update the current view
   * @param options Options to update the view
   */

	update (param: TViewCreateInput) {
		const data = this.getCachedData(),
			collection = this.cache.collection.get(
				(this.cache.block.get(data.parent_id) as ICollectionBlock).collection_id
			) as ICollection,
			[ , view_map ] = createViews(collection, [ param ], this.getProps());
		this.updateLastEditedProps();
		return view_map;
	}

	createSorts (args: TSortCreateInput[]) {
		const data = this.getCachedData(),
			schema_map = getSchemaMap(this.getCollection().schema),
			[ , sorts ] = getSortsMap(this.getCachedData(), this.getCollection().schema);
		for (let index = 0; index < args.length; index++) {
			const arg = args[index],
				target_sort = schema_map.get(arg[0]);
			if (target_sort) {
				if (typeof arg[2] === 'number') {
					sorts.splice(arg[2], 0, {
						property: target_sort.schema_id,
						direction: arg[1]
					});
				} else
					sorts.push({
						property: target_sort.schema_id,
						direction: arg[1]
					});
			}
		}
		this.updateLastEditedProps();
		this.stack.push(
			Operation.collection_view.update(this.id, [], {
				query2: data.query2
			})
		);
	}

	async updateSort (arg: UpdateType<ISchemaSortsMapValue, TSortUpdateInput>) {
		await this.updateSorts(typeof arg === 'function' ? arg : [ arg ], false);
	}

	async updateSorts (args: UpdateTypes<ISchemaSortsMapValue, TSortUpdateInput>, multiple?: boolean) {
		const data = this.getCachedData(),
			[ sorts_map, sorts ] = getSortsMap(this.getCachedData(), this.getCollection().schema);
		await this.updateIterate<ISchemaSortsMapValue, TSortUpdateInput>(
			args,
			{
				child_ids: Array.from(sorts_map.keys()),
				child_type: 'collection_view',
				multiple,
				manual: true,
				container: []
			},
			(schema_id) => sorts_map.get(schema_id),
			(_, sort, data) => {
				if (Array.isArray(data)) {
					const index = sorts.findIndex((data) => data.property === sort.schema_id);
					const [ direction, position ] = data;
					if (position !== null && position !== undefined) {
						sorts.splice(index, 1);
						sorts.splice(position, 0, {
							property: sort.schema_id,
							direction
						});
					}
				} else {
					const target_sort = sorts.find((data) => data.property === sort.schema_id) as ViewSorts;
					target_sort.direction = data;
				}
			}
		);
		this.stack.push(Operation.collection_view.update(this.id, [], { query2: data.query2 }));
	}

	async deleteSort (arg: FilterTypes<ISchemaSortsMapValue>) {
		await this.deleteSorts(typeof arg === 'string' ? [ arg ] : arg, false);
	}

	async deleteSorts (args: FilterTypes<ISchemaSortsMapValue>, multiple?: boolean) {
		const data = this.getCachedData(),
			[ sorts_map, sorts ] = getSortsMap(this.getCachedData(), this.getCollection().schema);
		await this.deleteIterate<ISchemaSortsMapValue>(
			args,
			{
				child_ids: Array.from(sorts_map.keys()),
				child_type: 'collection_view',
				multiple,
				manual: true,
				container: []
			},
			(schema_id) => sorts_map.get(schema_id),
			(_, sort) => {
				sorts.splice(sorts.findIndex((data) => data.property === sort.schema_id), 1);
			}
		);
		this.stack.push(Operation.collection_view.update(this.id, [], { query2: data.query2 }));
	}

	createFilters (args: TViewFilterCreateInput[]) {
		const schema_map = getSchemaMap(this.getCollection().schema),
			data = this.getCachedData(),
			filters = initializeViewFilters(this.getCachedData()).filters;
		populateFilters(args, filters, schema_map);
		this.updateLastEditedProps();
		this.stack.push(
			Operation.collection_view.update(this.id, [], {
				query2: data.query2
			})
		);
	}

	async updateFilter (arg: UpdateType<ISchemaFiltersMapValue, TViewFilterUpdateInput>) {
		await this.updateFilters(typeof arg === 'function' ? arg : [ arg ], false);
	}

	async updateFilters (args: UpdateTypes<ISchemaFiltersMapValue, TViewFilterUpdateInput>, multiple?: boolean) {
		const [ filters_map, { filters } ] = getFiltersMap(this.getCachedData(), this.getCollection().schema),
			data = this.getCachedData();

		await this.updateIterate<ISchemaFiltersMapValue, TViewFilterUpdateInput>(
			args,
			{
				child_ids: Array.from(filters_map.keys()),
				child_type: 'collection_view',
				multiple,
				manual: true,
				container: []
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
		this.stack.push(
			Operation.collection_view.update(this.id, [], {
				query2: data.query2
			})
		);
	}

	async deleteFilter (arg: FilterType<ISchemaFiltersMapValue>) {
		await this.deleteFilters(typeof arg === 'string' ? [ arg ] : arg);
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
		this.stack.push(
			Operation.collection_view.update(this.id, [], {
				query2: data.query2
			})
		);
	}

	async updateFormatVisibilityProperty (arg: UpdateType<ISchemaFormatMapValue, boolean>) {
		return await this.updateFormatVisibilityProperties(typeof arg === 'function' ? arg : [ arg ], false);
	}

	async updateFormatVisibilityProperties (args: UpdateTypes<ISchemaFormatMapValue, boolean>, multiple?: boolean) {
		const data = this.getCachedData(),
			[ format_properties_map, format_properties ] = getFormatPropertiesMap(data, this.getCollection().schema);
		await this.updateIterate<ISchemaFormatMapValue, boolean>(
			args,
			{
				child_type: 'collection_view',
				multiple,
				child_ids: Array.from(format_properties_map.keys()),
				manual: true,
				container: []
			},
			(name) => format_properties_map.get(name),
			(name, current_data, updated_data) => {
				const target_format_property = format_properties.find(
					(format_property) => format_property.property === current_data.schema_id
				) as ViewFormatProperties;
				target_format_property.visible = updated_data;
			}
		);
		this.stack.push(
			Operation.collection_view.update(this.id, [], {
				format: data.format
			})
		);
	}

	async updateFormatWidthProperty (arg: UpdateType<ISchemaFormatMapValue, number>) {
		return await this.updateFormatWidthProperties(typeof arg === 'function' ? arg : [ arg ], false);
	}

	async updateFormatWidthProperties (args: UpdateTypes<ISchemaFormatMapValue, number>, multiple?: boolean) {
		const data = this.getCachedData(),
			[ format_properties_map, format_properties ] = getFormatPropertiesMap(data, this.getCollection().schema);
		await this.updateIterate<ISchemaFormatMapValue, number>(
			args,
			{
				child_type: 'collection_view',
				multiple,
				child_ids: Array.from(format_properties_map.keys()),
				manual: true,
				container: []
			},
			(name) => format_properties_map.get(name),
			(name, current_data, updated_data) => {
				const target_format_property = format_properties.find(
					(format_property) => format_property.property === current_data.schema_id
				) as ViewFormatProperties;
				target_format_property.width = updated_data;
			}
		);
		this.stack.push(
			Operation.collection_view.update(this.id, [], {
				format: data.format
			})
		);
	}

	async updateFormatPositionProperty (arg: UpdateType<ISchemaFormatMapValue, number>) {
		return await this.updateFormatPositionProperties(typeof arg === 'function' ? arg : [ arg ], false);
	}

	async updateFormatPositionProperties (args: UpdateTypes<ISchemaFormatMapValue, number>, multiple?: boolean) {
		const data = this.getCachedData(),
			[ format_properties_map, format_properties ] = getFormatPropertiesMap(data, this.getCollection().schema);
		await this.updateIterate<ISchemaFormatMapValue, number>(
			args,
			{
				child_type: 'collection_view',
				multiple,
				child_ids: Array.from(format_properties_map.keys()),
				manual: true,
				container: []
			},
			(name) => format_properties_map.get(name),
			(name, current_data, new_position) => {
				const target_format_property_index = format_properties.findIndex(
						(format_property) => format_property.property === current_data.schema_id
					),
					target_format_property = format_properties[target_format_property_index];
				if (target_format_property_index !== new_position) {
					format_properties.splice(target_format_property_index, 1);
					format_properties.splice(new_position, 0, target_format_property);
				}
			}
		);
		this.stack.push(
			Operation.collection_view.update(this.id, [], {
				format: data.format
			})
		);
	}

	async updateFormatProperty (arg: UpdateType<ISchemaFormatMapValue, SchemaFormalPropertiesUpdateInput>) {
		await this.updateFormatProperties(typeof arg === 'function' ? arg : [ arg ], false);
	}

	async updateFormatProperties (
		args: UpdateTypes<ISchemaFormatMapValue, SchemaFormalPropertiesUpdateInput>,
		multiple?: boolean
	) {
		const data = this.getCachedData(),
			[ format_properties_map, format_properties ] = getFormatPropertiesMap(data, this.getCollection().schema);
		await this.updateIterate<ISchemaFormatMapValue, SchemaFormalPropertiesUpdateInput>(
			args,
			{
				child_type: 'collection_view',
				multiple,
				child_ids: Array.from(format_properties_map.keys()),
				manual: true,
				container: []
			},
			(name) => format_properties_map.get(name),
			(name, current_data, updated_data, container) => {
				const target_format_property_index = format_properties.findIndex(
						(format_property) => format_property.property === current_data.schema_id
					),
					target_format_property = format_properties[target_format_property_index];
				const { position, visible, width } = updated_data;
				if (target_format_property_index !== position && position !== undefined && position !== null) {
					format_properties.splice(target_format_property_index, 1);
					format_properties.splice(position, 0, target_format_property);
				}
				if (visible !== undefined && visible !== null) target_format_property.visible = visible;
				if (width !== undefined && width !== null) target_format_property.width = width;
			}
		);
		this.stack.push(
			Operation.collection_view.update(this.id, [], {
				format: data.format
			})
		);
	}
}

export default View;
