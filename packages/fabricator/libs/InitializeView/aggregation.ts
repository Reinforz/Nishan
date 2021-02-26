import { IBoardView, ITableView, ITimelineView, ViewAggregations } from '@nishans/types';

/**
 * Adds aggregations specific data to the view
 * @param data The view to initialize aggregations data to
 */
export function initializeViewAggregations (data: ITableView | IBoardView | ITimelineView) {
	// If query2 doesn't exist, assign it to a default one with default aggregations
	if (!data.query2) data.query2 = { aggregations: [] } as any;
	// If query2.aggregation doesn't exist, assign it to a default one
	if (data.query2 && !data.query2.aggregations) data.query2.aggregations = [];
	// Return the aggregation array
	return (data.query2 as any).aggregations as ViewAggregations[];
}
