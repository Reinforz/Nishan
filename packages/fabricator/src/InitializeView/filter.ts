import { IViewFilter, TView } from '@nishans/types';

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
