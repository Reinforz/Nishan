import { TFormula } from '@nishans/types';
import { generateFormulaArgFromProperty, formula_rt_map, generateFormulaArgs } from '../utils';
import { FormulaSchemaUnitInput, ISchemaMap, TResultType, TFormulaCreateInput } from '../types';

export function parseFormulaFromObject (formula: FormulaSchemaUnitInput['formula'], schema_map: ISchemaMap): TFormula {
	const res_formula = {
		args: []
	};
	function traverseFormula (parent: any, formula: TResultType | undefined) {
		if ((formula as TFormulaCreateInput).function) {
			const { function: function_name, args } = formula as TFormulaCreateInput,
				temp_args = [] as any;
			parent.push({
				name: function_name,
				type: 'function',
				result_type: formula_rt_map.get(function_name),
				args: temp_args
			});
			for (let index = 0; index < (args as any[]).length; index++)
				traverseFormula(temp_args, (args as any[])[index] as any);
		} else if ((formula as { property: string }).property)
			parent.push(generateFormulaArgFromProperty(formula as { property: string }, schema_map));
		else parent.push(generateFormulaArgs(formula));
	}

	traverseFormula(res_formula.args, formula);
	return res_formula.args[0];
}
