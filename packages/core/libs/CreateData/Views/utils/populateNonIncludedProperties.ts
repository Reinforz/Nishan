import { Schema, ViewFormatProperties } from '@nishans/types';

/**
 * Generates an array of format_properties that isn't included in the argument
 * @param schema collection schema
 * @param included_units Schema properties that has been included in the input
 * @return An array of default format properties formed using properties not included in the input argument
 */
export function populateNonIncludedProperties (schema: Schema, included_units: string[]) {
	const properties: ViewFormatProperties[] = [];
	// get the schema properties that are not included in the input argument
	const non_included_unit_properties = Object.keys(schema).filter((schema_id) => !included_units.includes(schema_id));
	// Iterates through the non included properties and push a default format property to the properties array
	non_included_unit_properties.forEach((property) => {
		// Set the default visible to be false and width to be 250
		properties.push({
			property,
			visible: false,
			width: 250
		});
	});

	return properties;
}
