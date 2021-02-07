import { Schema } from '@nishans/types';
import { ISchemaMap } from '@nishans/notion-formula';

export function generateSchemaMapFromCollectionSchema (schema: Schema) {
	const schema_map: ISchemaMap = new Map();
	Object.entries(schema).forEach(([ schema_id, value ]) => {
		schema_map.set(value.name, {
			schema_id,
			...value
		});
	});
	return schema_map;
}
