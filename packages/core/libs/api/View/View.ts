import { NotionCache } from "@nishans/cache";
import { PreExistentValueError } from "@nishans/errors";
import { InitializeView, ISchemaFiltersMapValue, ISchemaFormatMapValue, ISchemaSortsMapValue, PopulateViewData, PopulateViewMaps, RepositionParams, SchemaFormatPropertiesUpdateInput, TSortCreateInput, TSortUpdateInput, TViewFilterCreateInput, TViewFilterUpdateInput } from "@nishans/fabricator";
import { generateSchemaMapFromCollectionSchema } from '@nishans/notion-formula';
import { NotionOperationsObject, Operation } from '@nishans/operations';
import { ICollection, TCollectionBlock, TView, TViewUpdateInput } from '@nishans/types';
import { NotionUtils } from "@nishans/utils";
import {
  FilterType,
  FilterTypes,
  NishanArg,
  UpdateType,
  UpdateTypes
} from '../../';
import { transformToMultiple } from "../../utils";
import Data from '../Data';

/**
 * A class to represent view of Notion
 * @noInheritDoc
 */
class View<T extends TView> extends Data<T> {
	constructor (arg: NishanArg) {
		super({ ...arg, type: 'collection_view' });
	}

	async getCollection(){
    const data = this.getCachedData(), parent = await NotionCache.fetchDataOrReturnCached('block', data.parent_id, this.getProps()) as TCollectionBlock;
    return await NotionCache.fetchDataOrReturnCached('collection', parent.collection_id, this.getProps()) as ICollection;
	};

	async getCachedParentData () {
		return await NotionCache.fetchDataOrReturnCached('block', this.getCachedData().parent_id, this.getProps()) as TCollectionBlock;
	}

	async reposition (arg: RepositionParams) {
		await this.addToChildArray('block', await this.getCachedParentData(), arg);
	}

	/**
   * Update the current view
   * @param options Options to update the view
   */

	async update (updated_data: TViewUpdateInput) {
		const view_data = this.getCachedData();
		NotionUtils.deepMerge(view_data, updated_data);
    await NotionOperationsObject.executeOperations([Operation.collection_view.update(this.id, [], { ...updated_data })], this.getProps())
	}

	async createSorts (args: TSortCreateInput[]) {
		const data = this.getCachedData(),
			collection = await this.getCollection(),
			schema_map = generateSchemaMapFromCollectionSchema(collection.schema),
			[ sorts_map, sorts ] = PopulateViewMaps.sorts(data, collection.schema);
		for (let index = 0; index < args.length; index++) {
			const arg = args[index],
				schema_map_unit = NotionUtils.getSchemaMapUnit(schema_map, arg[0],  [ `${index}` ]),
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
				} else throw new PreExistentValueError('sort', arg[0], target_sort.sort.direction);
		}
		
    await NotionOperationsObject.executeOperations([Operation.collection_view.set(this.id, [ 'query2', 'sort' ], sorts)], this.getProps())
	}

	async updateSort (arg: UpdateType<ISchemaSortsMapValue, TSortUpdateInput>) {
		await this.updateSorts(transformToMultiple(arg), false);
	}

	async updateSorts (args: UpdateTypes<ISchemaSortsMapValue, TSortUpdateInput>, multiple?: boolean) {
		const data = this.getCachedData(),
			collection = await this.getCollection(),
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

    await NotionOperationsObject.executeOperations([Operation.collection_view.set(this.id, [ 'query2', 'sort' ], sorts)], this.getProps())
	}

	async deleteSort (arg: FilterType<ISchemaSortsMapValue>) {
		await this.deleteSorts(transformToMultiple(arg), false);
	}

	async deleteSorts (args: FilterTypes<ISchemaSortsMapValue>, multiple?: boolean) {
		const [ sorts_map, sorts ] = PopulateViewMaps.sorts(this.getCachedData(), (await this.getCollection()).schema);
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
    await NotionOperationsObject.executeOperations([Operation.collection_view.set(this.id, [ 'query2', 'sort' ], sorts)], this.getProps())
	}

	async createFilters (args: TViewFilterCreateInput[]) {
		const schema_map = generateSchemaMapFromCollectionSchema((await this.getCollection()).schema),
			data = this.getCachedData(),
			filters = InitializeView.filter(data).filters;
    PopulateViewData.query2.filters(args, filters, schema_map);
		
    await NotionOperationsObject.executeOperations([Operation.collection_view.update(this.id, ['query2', 'filter'], (data.query2 as any).filter)], this.getProps())
	}

	async updateFilter (arg: UpdateType<ISchemaFiltersMapValue, TViewFilterUpdateInput>) {
		await this.updateFilters(transformToMultiple(arg), false);
	}

	async updateFilters (args: UpdateTypes<ISchemaFiltersMapValue, TViewFilterUpdateInput>, multiple?: boolean) {
		const data = this.getCachedData(), 
      {schema} = await this.getCollection(), 
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
          child_filter.property = NotionUtils.getSchemaMapUnit(schema_map, name, ['name']).schema_id;

				NotionUtils.deepMerge(child_filter.filter, updated_filter);

				if (position !== null && position !== undefined) {
					filters.splice(filter_index, 1);
					filters.splice(position, 0, child_filter as any);
				}
			}
		);
    await NotionOperationsObject.executeOperations([Operation.collection_view.update(this.id, ['query2', 'filter'], (data.query2 as any).filter)], this.getProps())
	}

	async deleteFilter (arg: FilterType<ISchemaFiltersMapValue>) {
		await this.deleteFilters(transformToMultiple(arg));
	}

	async deleteFilters (args: FilterTypes<ISchemaFiltersMapValue>, multiple?: boolean) {
    const data = this.getCachedData(), 
      {schema} = await this.getCollection(), 
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

    await NotionOperationsObject.executeOperations([Operation.collection_view.update(this.id, ['query2', 'filter'], (data.query2 as any).filter)], this.getProps())
	}

	async updateFormatProperty (arg: UpdateType<ISchemaFormatMapValue, SchemaFormatPropertiesUpdateInput>) {
		await this.updateFormatProperties(transformToMultiple(arg), false);
	}

	async updateFormatProperties (
		args: UpdateTypes<ISchemaFormatMapValue, SchemaFormatPropertiesUpdateInput>,
		multiple?: boolean
	) {
		const data = this.getCachedData(),
			[ format_properties_map, format_properties ] = PopulateViewMaps.properties(data, (await this.getCollection()).schema);
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
    await NotionOperationsObject.executeOperations([Operation.collection_view.set(this.id, [`format`, `${data.type}_properties`], format_properties)], this.getProps())
	}
}

export default View;
