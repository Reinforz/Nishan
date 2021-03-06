import { NotionErrors } from '@nishans/errors';
import {
	ISchemaAggregationMap,
	ISchemaAggregationMapValue,
	NotionFabricator,
	TAggregationsCreateInput,
	TAggregationsUpdateInput
} from '@nishans/fabricator';
import { NotionOperations } from '@nishans/operations';
import { IBoardView, ITableView, ITimelineView } from '@nishans/types';
import { ISchemaMap, NotionUtils } from '@nishans/utils';
import { FilterType, FilterTypes, INotionCoreOptions, UpdateType, UpdateTypes } from '../../';
import { transformToMultiple } from '../../utils';
import View from './View';

export function detectAggregationErrors (
	schema_map: ISchemaMap,
	input: Omit<TAggregationsCreateInput, 'aggregator'>,
	aggregations_map: ISchemaAggregationMap
) {
	const { name } = input;
	const schema_map_unit = NotionUtils.getSchemaMapUnit(schema_map, name, [ 'name' ]);
	const current_aggregation = aggregations_map.get(name);
	if (current_aggregation)
		throw new NotionErrors.pre_existent_value('aggregation', name, current_aggregation.aggregation.aggregator);
	return schema_map_unit;
}
/**
 * A class to represent the aggregator methods for views that supports it
 * @noInheritDoc
 */
class Aggregator<T extends ITableView | IBoardView | ITimelineView> extends View<T> {
	constructor (arg: INotionCoreOptions) {
		super({ ...arg });
	}

	async createAggregation (arg: TAggregationsCreateInput) {
		await this.createAggregations([ arg ]);
	}

	async createAggregations (args: TAggregationsCreateInput[]) {
		const data = this.getCachedData(),
			collection = await this.getCollection(),
			schema_map = NotionUtils.generateSchemaMap(collection.schema),
			[ aggregations_map, aggregations ] = NotionFabricator.PopulateViewMaps.aggregations(
				this.getCachedData(),
				collection.schema
			);
		for (let index = 0; index < args.length; index++) {
			const { aggregator } = args[index];
			const schema_map_unit = detectAggregationErrors(schema_map, args[index], aggregations_map);
			aggregations.push({
				property: schema_map_unit.schema_id,
				aggregator
			});
		}

		await NotionOperations.executeOperations(
			[
				NotionOperations.Chunk.collection_view.set(
					this.id,
					[ 'query2', 'aggregations' ],
					(data.query2 as any).aggregations
				)
			],
			this.getProps()
		);
	}

	async updateAggregation (arg: UpdateType<ISchemaAggregationMapValue, TAggregationsUpdateInput>) {
		await this.updateAggregations(transformToMultiple(arg), false);
	}

	async updateAggregations (
		args: UpdateTypes<ISchemaAggregationMapValue, TAggregationsUpdateInput>,
		multiple?: boolean
	) {
		const data = this.getCachedData(),
			[ aggregations_map ] = NotionFabricator.PopulateViewMaps.aggregations(
				this.getCachedData(),
				(await this.getCollection()).schema
			);

		await this.updateIterate<ISchemaAggregationMapValue, TAggregationsUpdateInput>(
			args,
			{
				child_ids: Array.from(aggregations_map.keys()),
				child_type: 'collection_view',
				manual: true,
				container: [],
				multiple,
				initialize_cache: false
			},
			(name) => aggregations_map.get(name),
			(_, { aggregation }, updated_data) => {
				const { aggregator } = updated_data;
				aggregation.aggregator = aggregator;
			}
		);

		await NotionOperations.executeOperations(
			[
				NotionOperations.Chunk.collection_view.set(
					this.id,
					[ 'query2', 'aggregations' ],
					(data.query2 as any).aggregations
				)
			],
			this.getProps()
		);
	}

	async deleteAggregation (arg: FilterType<ISchemaAggregationMapValue>) {
		await this.deleteAggregations(transformToMultiple(arg), false);
	}

	async deleteAggregations (args: FilterTypes<ISchemaAggregationMapValue>, multiple?: boolean) {
		const [ aggregations_map, aggregations ] = NotionFabricator.PopulateViewMaps.aggregations(
			this.getCachedData(),
			(await this.getCollection()).schema
		);

		await this.deleteIterate<ISchemaAggregationMapValue>(
			args,
			{
				child_type: 'collection_view',
				multiple,
				child_ids: Array.from(aggregations_map.keys()),
				manual: true,
				container: [],
				initialize_cache: false
			},
			(name) => aggregations_map.get(name),
			(_, aggregation) => {
				aggregations.splice(aggregations.findIndex((data) => data.property === aggregation.schema_id), 1);
			}
		);

		await NotionOperations.executeOperations(
			[ NotionOperations.Chunk.collection_view.set(this.id, [ 'query2', 'aggregations' ], aggregations) ],
			this.getProps()
		);
	}
}

export default Aggregator;
