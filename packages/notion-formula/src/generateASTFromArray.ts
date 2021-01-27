import { TFormula, TFunctionName } from '@nishans/types';
import { formula_rt_map, generateFormulaArgFromProperty, generateFormulaArgs } from '../utils';
import { AnyArrayResultType, FormulaArraySchemaUnitInput, ISchemaMap } from '../types';

export function parseFormulaFromArray (
	formula: FormulaArraySchemaUnitInput['formula'],
	schema_map: ISchemaMap
): TFormula {
	const res_formula = {
		args: []
	};
	function traverseFormula (parent: any, formula: AnyArrayResultType | undefined) {
		if (Array.isArray(formula)) {
			const [ function_name, args ] = formula as [TFunctionName, any[]],
				temp_args = [] as any;
			parent.push({
				name: function_name,
				type: 'function',
				result_type: formula_rt_map.get(function_name),
				args: temp_args
			});
			for (let index = 0; index < args.length; index++) traverseFormula(temp_args, args[index] as any);
		} else if ((formula as { property: string }).property)
			parent.push(generateFormulaArgFromProperty(formula as { property: string }, schema_map));
		else parent.push(generateFormulaArgs(formula));
	}

	traverseFormula(res_formula.args, formula);
	return res_formula.args[0];
}
