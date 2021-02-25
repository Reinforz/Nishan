import { ITableViewFormat, Schema, TViewType, ViewFormatProperties } from '@nishans/types';

/**
 * Generates an array of format_properties that isn't included in the argument
 * * Checks to see which properties are not included in the input
 * * Iterates through the properties that are not included and based on
 *  * view_type=table push a default format property object with width attached
 *  * view_type!=table push a default format property without width attached
 * @param schema collection schema
 * @param included_units array of schema_id that has been added to the view format properties
 * @return An array of default format properties formed using properties not included in the input argument
 */
export function populateNonIncludedProperties (view_type: TViewType, schema: Schema, included_units: string[]) {
	// get the schema properties that are not included in the input argument
	const non_included_unit_properties = Object.keys(schema).filter((schema_id) => !included_units.includes(schema_id));
	if (view_type === 'table') {
		const properties: ITableViewFormat['table_properties'] = [];
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
	} else {
		const properties: ViewFormatProperties[] = [];
		// Iterates through the non included properties and push a default format property to the properties array
		non_included_unit_properties.forEach((property) => {
			// Set the default visible to be false, without width property
			properties.push({
				property,
				visible: false
			});
		});
		return properties;
	}
}
