import { Schema, TSchemaUnit } from '@nishans/types';

export function orderSchema (schema: Schema): (TSchemaUnit & { schema_id: string })[] {
	return Object.entries(schema)
		.sort(([ keyA, valueA ], [ keyB, valueB ]) => (valueA.name < valueB.name ? -1 : 1))
		.map(([ key, value ]) => ({ ...value, schema_id: key }));
}
