import { TFormula, TFormulaResultType, TFunctionName, TSchemaUnitType } from '@nishans/types';
import { FormulaSchemaUnitInput, ISchemaMap, TFormulaCreateInput, TResultType } from './types';

const formula_info_map: Map<TFunctionName, TFormulaResultType | 'auto'> = new Map([
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
	[ 'dateBetween', 'date' ],
	[ 'dateBetween', 'date' ],
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

export function parseFormula (formula: FormulaSchemaUnitInput['formula'], schema_map: ISchemaMap): TFormula {
	const res_formula = {
		args: []
	};
	function traverseFormula (parent: any, formula: TResultType | undefined) {
		if ((formula as TFormulaCreateInput).function) {
			const { function: function_name, args } = formula as TFormulaCreateInput,
				result_type = formula_info_map.get(function_name),
        temp_args = [] as any;
			parent.push({
				name: function_name,
				type: 'function',
				result_type: result_type ?? (formula as any).result_type,
				args: temp_args
      });
      // ? FEAT:1:E unknown function used
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
		} else {
			const schema_name = (formula as { property: string }).property,
				result = schema_map.get(schema_name);
			if (result) {
				const { schema_id, type } = result;
				let result_type: TFormulaResultType = '' as any;
				if (result.type === 'formula') result_type = result.formula.result_type;
				else result_type = formulateResultTypeFromSchemaType(type);
				parent.push({
					type: 'property',
					id: schema_id,
					name: result.name,
					result_type
				});
			}
		}
	}

	traverseFormula(res_formula.args, formula);
	return res_formula.args[0];
}