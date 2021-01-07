import { FormulaSchemaUnit, TFormulaResultType, TFunctionFormula, TFunctionName } from '@nishans/types';
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

export function parseFormula (formula: FormulaSchemaUnitInput): FormulaSchemaUnit {
	const res_formula = {
		args: []
	};

	function traverseFormula (parent: any, formula: TResultType) {
		if (Array.isArray(formula)) {
			const [ name, args ] = formula;
			const result_type = formula_info_map.get(name);
			const temp_args = [] as TFunctionFormula['args'];
			parent.push({
				name,
				type: 'function',
				result_type,
				args: temp_args
			});
			for (let index = 0; index < args.length; index++) traverseFormula(temp_args, args[index] as any);
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
			parent.push({
				type: 'property',
				id: formula.property.toString().toLowerCase(),
				name: formula.property.toString(),
				result_type: 'text'
			});
		}
	}

	traverseFormula(res_formula.args, formula.formula);
	return {
		name: formula.name,
		type: 'formula',
		formula: res_formula.args[0]
	};
}
