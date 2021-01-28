import { TFormulaResultType, TSchemaUnitType } from '@nishans/types';

export function formulateResultTypeFromSchemaType (type: TSchemaUnitType): TFormulaResultType {
	switch (type) {
		case 'checkbox':
			return 'checkbox';
		case 'created_time':
		case 'last_edited_time':
		case 'date':
			return 'date';
		case 'email':
		case 'file':
		case 'created_by':
		case 'last_edited_by':
		case 'multi_select':
		case 'select':
		case 'phone_number':
		case 'url':
		case 'title':
		case 'text':
		case 'relation':
			return 'text';
		case 'number':
			return 'number';
		default:
			return 'number';
	}
}
