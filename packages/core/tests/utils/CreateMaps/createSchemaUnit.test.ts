import { ISchemaUnitMap } from '../../../types';
import { CreateMaps } from '../../../utils';

const schema_unit_map_keys: (keyof ISchemaUnitMap)[] = [
	'text',
	'number',
	'select',
	'multi_select',
	'title',
	'date',
	'person',
	'file',
	'checkbox',
	'url',
	'email',
	'phone_number',
	'formula',
	'relation',
	'rollup',
	'created_time',
	'created_by',
	'last_edited_time',
	'last_edited_by'
];

describe('createSchemaUnitMap', () => {
	const schema_unit_map = CreateMaps.schema_unit();

	it(`Should contain correct keys and value`, () => {
		schema_unit_map_keys.forEach((schema_unit_map_key) =>
			expect(schema_unit_map[schema_unit_map_key] instanceof Map).toBe(true)
		);
	});
});
