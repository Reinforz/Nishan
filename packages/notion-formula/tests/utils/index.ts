import { ISchemaMap } from '../../src';

export const test_schema_map: ISchemaMap = new Map([
	[ 'number', { schema_id: 'number', type: 'number', name: 'number' } ],
	[ 'text', { schema_id: 'text', type: 'text', name: 'text' } ],
	[ 'checkbox', { schema_id: 'checkbox', type: 'checkbox', name: 'checkbox' } ],
	[ 'date', { schema_id: 'date', type: 'date', name: 'date' } ],
	[
		'formula',
		{
			schema_id: 'formula',
			type: 'formula',
			name: 'formula',
			formula: {
				type: 'function',
				name: 'abs',
				result_type: 'number',
				args: [
					{
						type: 'constant',
						value: '1',
						value_type: 'number',
						retunr_type: 'number'
					}
				]
			}
		} as any
	],
	[
		'Rollup',
		{
			schema_id: 'rollup',
			type: 'rollup',
			id: 'rollup',
			name: 'Rollup',
			collection_id: '123',
			relation_property: 'goal',
			target_property: 'text',
			target_property_type: 'number'
		}
	]
]);
