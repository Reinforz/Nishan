import { ISchemaMap } from '../libs';

// Title schema unit
export const tsu: any = {
	type: 'title',
	name: 'Title'
};

// Date schema unit
export const dsu: any = {
	type: 'date',
	name: 'Date'
};

// Title schema map unit
export const tsmu: any = [
	'Title',
	{
		schema_id: 'title',
		...tsu
	}
];

// Date schema map unit
export const dsmu: any = [
	'Date',
	{
		schema_id: 'date',
		...dsu
	}
];

// constant text

export const ct = {
	type: 'constant',
	value: 'text',
	result_type: 'text',
	value_type: 'string'
};

export const pt = {
	type: 'property',
	name: 'text',
	result_type: 'text',
	id: 'text'
};

// Constant 1
export const cn = {
	type: 'constant',
	value: '1',
	value_type: 'number',
	result_type: 'number'
};

// Symbol e
export const sn = {
	type: 'symbol',
	name: 'e',
	result_type: 'number'
};

// Symbol true
export const sc = {
	type: 'symbol',
	name: 'true',
	result_type: 'checkbox'
};

export const scf = {
	type: 'symbol',
	name: 'false',
	result_type: 'checkbox'
};

// property number
export const pn = {
	type: 'property',
	name: 'number',
	id: 'number',
	result_type: 'number'
};

// abs fn ast
export const abs = (args: any) => {
	return {
		name: 'abs',
		type: 'function',
		args,
		result_type: 'number'
	};
};

export const test_schema_map: ISchemaMap = new Map([
	[ 'number', { schema_id: 'number', type: 'number', name: 'number' } ],
	[ 'text', { schema_id: 'text', type: 'text', name: 'text' } ],
	[ 'text space', { schema_id: 'text', type: 'text', name: 'text space' } ],
	[ 'text,commas', { schema_id: 'text', type: 'text', name: 'text,commas' } ],
	[ 'text(left parenthesis', { schema_id: 'text', type: 'text', name: 'text(left parenthesis' } ],
	[ 'text)right parenthesis', { schema_id: 'text', type: 'text', name: 'text)right parenthesis' } ],
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
						return_type: 'number'
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
