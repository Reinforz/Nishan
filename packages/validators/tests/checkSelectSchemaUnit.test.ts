import { NotionValidators } from '../libs';

it(`Should throw error if schema_map_unit.type !== select`, () => {
	expect(() =>
		NotionValidators.checkSelectSchemaUnit(
			{
				schema_id: 'text',
				type: 'text',
				name: 'Text'
			},
			[]
		)
	).toThrow();
});

it(`Should work correctly if schema_map_unit.type === select`, () => {
	expect(() =>
		NotionValidators.checkSelectSchemaUnit(
			{
				schema_id: 'select',
				type: 'select',
				name: 'Select',
				options: []
			},
			[]
		)
	).not.toThrow();
});
