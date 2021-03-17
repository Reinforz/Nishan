import { TView, ViewSorts } from '@nishans/types';

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
