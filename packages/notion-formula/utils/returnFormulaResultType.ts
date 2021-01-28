import { TFormulaResultType, TFunctionName, TSchemaUnitType } from '@nishans/types';

export const formula_rt_map: Map<TFunctionName, TFormulaResultType> = new Map([
	[ 'equal', 'checkbox' ],
	[ 'unequal', 'checkbox' ],
	[ 'and', 'checkbox' ],
	[ 'or', 'checkbox' ],
	[ 'larger', 'checkbox' ],
	[ 'largerEq', 'checkbox' ],
	[ 'smaller', 'checkbox' ],
	[ 'smallerEq', 'checkbox' ],
	[ 'not', 'checkbox' ],
	[ 'test', 'checkbox' ],
	[ 'contains', 'checkbox' ],
	[ 'empty', 'checkbox' ],

	[ 'subtract', 'number' ],
	[ 'divide', 'number' ],
	[ 'multiply', 'number' ],
	[ 'pow', 'number' ],
	[ 'mod', 'number' ],
	[ 'unaryPlus', 'number' ],
	[ 'unaryMinus', 'number' ],
	[ 'length', 'number' ],
	[ 'toNumber', 'number' ],
	[ 'abs', 'number' ],
	[ 'cbrt', 'number' ],
	[ 'ceil', 'number' ],
	[ 'exp', 'number' ],
	[ 'floor', 'number' ],
	[ 'ln', 'number' ],
	[ 'log10', 'number' ],
	[ 'log2', 'number' ],
	[ 'max', 'number' ],
	[ 'min', 'number' ],
	[ 'round', 'number' ],
	[ 'sign', 'number' ],
	[ 'sqrt', 'number' ],
	[ 'timestamp', 'number' ],
	[ 'minute', 'number' ],
	[ 'hour', 'number' ],
	[ 'day', 'number' ],
	[ 'date', 'number' ],
	[ 'month', 'number' ],
	[ 'year', 'number' ],

	[ 'start', 'date' ],
	[ 'end', 'date' ],
	[ 'now', 'date' ],
	[ 'fromTimestamp', 'date' ],
	[ 'dateAdd', 'date' ],
	[ 'dateSubtract', 'date' ],
	[ 'dateBetween', 'number' ],
	[ 'formatDate', 'date' ],

	[ 'concat', 'text' ],
	[ 'join', 'text' ],
	[ 'slice', 'text' ],
	[ 'format', 'text' ],
	[ 'replace', 'text' ],
	[ 'replaceAll', 'text' ]
]);

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
