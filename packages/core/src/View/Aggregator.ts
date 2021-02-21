import { PreExistentValueError, UnknownPropertyReferenceError } from '@nishans/errors';
import { generateSchemaMapFromCollectionSchema, ISchemaMap } from '@nishans/notion-formula';
import { Operation } from '@nishans/operations';
import { IBoardView, ITableView, ITimelineView } from '@nishans/types';
import { PopulateViewMaps, transformToMultiple } from '../../libs';
import {
	FilterType,
	FilterTypes,
	ISchemaAggregationMap,
	ISchemaAggregationMapValue,
	NishanArg,
	TAggregationsCreateInput,
	TAggregationsUpdateInput,
	UpdateType,
	UpdateTypes
} from '../../types';
import View from './View';

export function detectAggregationErrors (
	schema_map: ISchemaMap,
	input: Omit<TAggregationsCreateInput, 'aggregator'>,
	aggregations_map: ISchemaAggregationMap
) {
	const { name } = input;
	const schema_map_unit = schema_map.get(name);
	if (!schema_map_unit) throw new UnknownPropertyReferenceError(name, [ 'name' ]);
	const current_aggregation = aggregations_map.get(name);
	if (current_aggregation)
		throw new PreExistentValueError('aggregation', name, current_aggregation.aggregation.aggregator);
	return schema_map_unit;
}
/**
 * A class to represent the aggregator methods for views that supports it
 * @noInheritDoc
 */
class Aggregator<T extends ITableView | IBoardView | ITimelineView> extends View<T> {
	constructor (arg: NishanArg) {
		super({ ...arg });
	}

	createAggregation (arg: TAggregationsCreateInput) {
		this.createAggregations([ arg ]);
	}

	createAggregations (args: TAggregationsCreateInput[]) {
		const data = this.getCachedData(),
			collection = this.getCollection(),
			schema_map = generateSchemaMapFromCollectionSchema(collection.schema),
			[ aggregations_map, aggregations ] = PopulateViewMaps.aggregations(this.getCachedData(), collection.schema);
		for (let index = 0; index < args.length; index++) {
			const { aggregator } = args[index];
			const schema_map_unit = detectAggregationErrors(schema_map, args[index], aggregations_map);
			aggregations.push({
				property: schema_map_unit.schema_id,
				aggregator
			});
		}

		this.Operations.pushToStack(
			Operation.collection_view.update(this.id, [ 'query2', 'aggregations' ], {
				aggregations: (data.query2 as any).aggregations
			})
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
			[ aggregations_map ] = PopulateViewMaps.aggregations(this.getCachedData(), this.getCollection().schema);

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

		this.Operations.pushToStack(
			Operation.collection_view.update(this.id, [ 'query2', 'aggregations' ], {
				aggregations: (data.query2 as any).aggregations
			})
		);
	}

	async deleteAggregation (arg: FilterType<ISchemaAggregationMapValue>) {
		await this.deleteAggregations(transformToMultiple(arg), false);
	}

	async deleteAggregations (args: FilterTypes<ISchemaAggregationMapValue>, multiple?: boolean) {
		const [ aggregations_map, aggregations ] = PopulateViewMaps.aggregations(
				this.getCachedData(),
				this.getCollection().schema
			),
			data = this.getCachedData();
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

		this.Operations.pushToStack(
			Operation.collection_view.update(this.id, [ 'query2', 'aggregations' ], {
				aggregations: (data.query2 as any).aggregations
			})
		);
	}
}

export default Aggregator;
