import { NotionConstants } from '../libs';

it('NotionConstants.schema_units', () => {
	expect(NotionConstants.schema_unit_types()).toStrictEqual([
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
	]);
});
