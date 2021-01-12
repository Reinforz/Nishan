import { IBoardView, ICollection, ITableView, ITimelineView } from '@nishans/types';
import { ISchemaAggregationMap, ISchemaMap } from '../types';
import { initializeViewAggregations } from './initializeView';

export function getSchemaMap (collection: ICollection) {
	const schema_map: ISchemaMap = new Map();
	Object.entries(collection.schema).forEach(([ schema_id, value ]) => {
		schema_map.set(value.name, {
			schema_id,
			...value
		});
	});
	return schema_map;
}

export function getAggregationsMap(data: ITableView | IBoardView | ITimelineView, collection: ICollection){
  const aggregations_map: ISchemaAggregationMap = new Map(), aggregations = initializeViewAggregations(data);
  data.query2?.aggregations?.forEach(aggregation => {
    const schema_unit = collection.schema[aggregation.property];
    aggregations_map.set(schema_unit.name, {
      schema_id: aggregation.property,
      ...schema_unit,
      aggregation
    })
  });

  return [aggregations_map, aggregations] as const;
}