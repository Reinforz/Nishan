import { populateViewFormat } from './format';
import { populateViewProperties } from './format_properties';
import { populateNonIncludedProperties } from './non_included_props';
import { populateViewQuery2 } from './query2';

export const PopulateViewData = {
	format_properties: populateViewProperties,
	non_included_props: populateNonIncludedProperties,
	query2: populateViewQuery2,
	format: populateViewFormat
};
