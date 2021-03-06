import { TSchemaUnitType } from '@nishans/types';
import { NotionConstants } from '../libs';

it('NotionConstants.schema_units', () => {
	const schema_unit_types = NotionConstants.schemaUnitTypes();
	const schema_unit_types_map: Map<TSchemaUnitType, true> = new Map();
	schema_unit_types.forEach((schema_unit_type) => schema_unit_types_map.set(schema_unit_type, true));

	const expected_schema_unit_types: TSchemaUnitType[] = [
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
	expect(schema_unit_types.length === expected_schema_unit_types.length).toBe(true);
	expected_schema_unit_types.forEach((expected_schema_unit_type) =>
		expect(schema_unit_types_map.get(expected_schema_unit_type)).toBe(true)
	);
});
