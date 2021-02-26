import { initializeViewAggregations } from './aggregation';
import { initializeViewFilters } from './filter';
import { initializeViewSorts } from './sort';

export const InitializeView = {
	sort: initializeViewSorts,
	aggregation: initializeViewAggregations,
	filter: initializeViewFilters
};
