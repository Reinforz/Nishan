import { Schema } from '@nishans/types';
import { ISchemaMap } from './types';

/**
 * Generates a schema_map from the passed schema
 * @param schema The collection schema used to generate the schema_map
 * @returns The generated schema map
 */
export function generateSchemaMap (schema: Schema) {
	const schema_map: ISchemaMap = new Map();
	// Map through each key of the passed schema and use its name property to act as a key to the map
	Object.entries(schema).forEach(([ schema_id, value ]) => {
		schema_map.set(value.name, {
			schema_id,
			...value
		});
	});
	return schema_map;
}
