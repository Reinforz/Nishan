import { Schema, ViewFormatProperties } from '@nishans/types';

export function populateNonIncludedProperties (schema: Schema, included_units: string[]) {
	const properties: ViewFormatProperties[] = [];
	const non_included_unit_entries = Object.keys(schema).filter((schema_id) => !included_units.includes(schema_id));
	non_included_unit_entries.forEach((property) => {
		properties.push({
			property,
			visible: false,
			width: 250
		});
	});

	return properties;
}
