import { populateViewQuery2Aggregation } from './aggregation';
import { populateViewQuery2Filters } from './filters';
import { populateViewQuery2 } from './query2';
import { populateViewQuery2Sort } from './sort';

export const PopulateViewQuery2Data = {
	sort: populateViewQuery2Sort,
	filters: populateViewQuery2Filters,
	query2: populateViewQuery2,
	aggregation: populateViewQuery2Aggregation
};
