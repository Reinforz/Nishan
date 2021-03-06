import { TSchemaUnitType } from '@nishans/types';

export const createSchemaUnitTypes = () => {
	return [
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
	] as TSchemaUnitType[];
};
