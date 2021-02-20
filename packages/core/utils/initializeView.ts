import { IBoardView, ITableView, ITimelineView, IViewFilter, TView, ViewAggregations, ViewSorts } from '@nishans/types';

/**
 * Adds filter specific data to the view
 * @param data The view to initialize filter data to
 */
export function initializeViewFilters (data: TView) {
	// If query2 doesn't exist, assign it to a default one with default filter
	if (!data.query2) data.query2 = { filter: { operator: 'and', filters: [] } } as any;
	// If query2.filter doesn't exist, assign it to a default one
	if (data.query2 && !data.query2.filter) data.query2.filter = { operator: 'and', filters: [] };
	// Return the filter object
	return (data.query2 as any).filter as IViewFilter;
}

/**
 * Adds sort specific data to the view
 * @param data The view to initialize sort data to
 */
export function initializeViewSorts (data: TView) {
	// If query2 doesn't exist, assign it to a default one with default sort
	if (!data.query2) data.query2 = { sort: [] } as any;
	// If query2.sort doesn't exist, assign it to a default one
	if (data.query2 && !data.query2.sort) data.query2.sort = [];
	// Return the sort array
	return (data.query2 as any).sort as ViewSorts[];
}

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
