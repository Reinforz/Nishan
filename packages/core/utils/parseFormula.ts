import { TFormula, TFormulaResultType, TFunctionName, TSchemaUnit, TSchemaUnitType } from '@nishans/types';
import { FormulaSchemaUnitInput, TResultType } from '../types';

const formula_info_map: Map<TFunctionName, TFormulaResultType> = new Map([
	[ 'equal', 'checkbox' ],
	[ 'unequal', 'checkbox' ],
	[ 'and', 'checkbox' ],
	[ 'or', 'checkbox' ],
	[ 'larger', 'checkbox' ],
	[ 'largerEq', 'checkbox' ],
	[ 'smaller', 'checkbox' ],
	[ 'smallerEq', 'checkbox' ],
	[ 'not', 'checkbox' ],
	[ 'subtract', 'number' ],
	[ 'divide', 'number' ],
	[ 'multiple', 'number' ],
	[ 'pow', 'number' ],
	[ 'mod', 'number' ],
	[ 'unaryPlus', 'number' ],
	[ 'unaryMinus', 'number' ],
	[ 'add', 'number' ],
	[ 'if', 'number' ],
	[ 'concat', 'text' ],
	[ 'join', 'text' ],
	[ 'slice', 'text' ],
	[ 'format', 'text' ],
	[ 'toNumber', 'number' ],
	[ 'length', 'number' ],
	[ 'contains', 'checkbox' ],
	[ 'replace', 'text' ],
	[ 'replaceAll', 'text' ],
	[ 'test', 'checkbox' ],
	[ 'empty', 'checkbox' ],
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
	[ 'start', 'date' ],
	[ 'end', 'date' ],
	[ 'now', 'date' ],
	[ 'timestamp', 'number' ],
	[ 'fromTimestamp', 'date' ],
	[ 'minute', 'number' ],
	[ 'hour', 'number' ],
	[ 'day', 'number' ],
	[ 'date', 'number' ],
	[ 'month', 'number' ],
	[ 'year', 'number' ],
	[ 'dateAdd', 'date' ],
	[ 'dateSubtract', 'date' ],
	[ 'dateBetween', 'date' ],
	[ 'dateBetween', 'date' ],
	[ 'formatDate', 'date' ]
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
		case 'rollup':
			return 'number';
		default:
			return 'number';
	}
}

export function parseFormula (
	formula: FormulaSchemaUnitInput['formula'],
	schema_map: Map<string, { id: string } & TSchemaUnit>
): TFormula {
	const res_formula = {
		args: []
	};
	function traverseFormula (parent: any, formula: TResultType) {
		if (Array.isArray(formula)) {
			const [ name, args ] = formula;
			const result_type = formula_info_map.get(name);
			const temp_args = [] as any;
			parent.push({
				name,
				type: 'function',
				result_type,
				args: temp_args
			});
			if (Array.isArray(args))
				for (let index = 0; index < args.length; index++) traverseFormula(temp_args, args[index] as any);
			else traverseFormula(temp_args, args);
		} else if (typeof formula === 'number') {
			parent.push({
				type: 'constant',
				value: formula.toString(),
				value_type: 'number',
				result_type: 'number'
			});
		} else if (typeof formula === 'boolean') {
			parent.push({
				type: 'symbol',
				name: formula.toString(),
				result_type: 'checkbox'
			});
		} else if (typeof formula === 'string') {
			parent.push({
				type: 'constant',
				value: formula.toString(),
				value_type: 'string',
				result_type: 'text'
			});
		} else if (!Array.isArray(formula)) {
			const schema_name = formula.property.toString(),
				result = schema_map.get(schema_name);
			if (result) {
				const { id, type } = result;
				let result_type: TFormulaResultType = '' as any;
				if (result.type === 'formula') result_type = result.formula.result_type;
				else result_type = formulateResultTypeFromSchemaType(type);
				parent.push({
					type: 'property',
					id,
					name: schema_name,
					result_type
				});
			}
		}
	}

	traverseFormula(res_formula.args, formula);
	return res_formula.args[0];
}
