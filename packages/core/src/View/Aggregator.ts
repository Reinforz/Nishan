import { ISchemaMap } from '@nishans/notion-formula';
import { Operation } from '@nishans/operations';
import { IBoardView, ITableView, ITimelineView } from '@nishans/types';
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
import { getAggregationsMap, getSchemaMap, transformToMultiple, UnknownPropertyReferenceError } from '../../utils';
import View from './View';

export function detectAggregationErrors (
	schema_map: ISchemaMap,
	input: Omit<TAggregationsCreateInput, 'aggregator'>,
	aggregations_map: ISchemaAggregationMap
) {
	const { type, name } = input;
	const schema_map_unit = schema_map.get(name);
	if (!schema_map_unit) throw new UnknownPropertyReferenceError(name, [ 'name' ]);
	if (type !== schema_map_unit.type) throw new Error(`Type mismatch, ${type} not equal to ${schema_map_unit.type}`);
	if (aggregations_map.get(name)) throw new Error(`An aggregation for ${name} already exists.`);
	return schema_map_unit;
}
/**
 * A class to represent the aggregrator methods for views that supports it
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
			schema_map = getSchemaMap(collection.schema),
			[ aggregations_map, aggregations ] = getAggregationsMap(this.getCachedData(), collection.schema);
		for (let index = 0; index < args.length; index++) {
			const { aggregator } = args[index];
			const schema_map_unit = detectAggregationErrors(schema_map, args[index], aggregations_map);
			aggregations.push({
				property: schema_map_unit.schema_id,
				aggregator
			});
		}

		this.Operations.stack.push(
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
		this.init_cache = true;
		const data = this.getCachedData(),
			[ aggregations_map ] = getAggregationsMap(this.getCachedData(), this.getCollection().schema);

		await this.updateIterate<ISchemaAggregationMapValue, TAggregationsUpdateInput>(
			args,
			{
				child_ids: Array.from(aggregations_map.keys()),
				child_type: 'collection_view',
				manual: true,
				container: [],
				multiple
			},
			(name) => aggregations_map.get(name),
			(_, { aggregation }, updated_data) => {
				const { aggregator } = updated_data;
				aggregation.aggregator = aggregator;
			}
		);

		this.Operations.stack.push(
			Operation.collection_view.update(this.id, [ 'query2', 'aggregations' ], {
				aggregations: (data.query2 as any).aggregations
			})
		);
	}

	async deleteAggregation (arg: FilterType<ISchemaAggregationMapValue>) {
		await this.deleteAggregations(transformToMultiple(arg), false);
	}

	async deleteAggregations (args: FilterTypes<ISchemaAggregationMapValue>, multiple?: boolean) {
		this.init_cache = true;
		const [ aggregations_map, aggregations ] = getAggregationsMap(this.getCachedData(), this.getCollection().schema),
			data = this.getCachedData();
		await this.deleteIterate<ISchemaAggregationMapValue>(
			args,
			{
				child_type: 'collection_view',
				multiple,
				child_ids: Array.from(aggregations_map.keys()),
				manual: true,
				container: []
			},
			(name) => aggregations_map.get(name),
			(_, aggregation) => {
				aggregations.splice(aggregations.findIndex((data) => data.property === aggregation.schema_id), 1);
			}
		);

		this.Operations.stack.push(
			Operation.collection_view.update(this.id, [ 'query2', 'aggregations' ], {
				aggregations: (data.query2 as any).aggregations
			})
		);
	}
}

export default Aggregator;
