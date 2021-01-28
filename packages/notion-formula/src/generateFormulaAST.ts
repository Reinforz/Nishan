import { TFormula, TFunctionName } from '@nishans/types';
import { generateFormulaArgFromProperty, formula_rt_map, generateFormulaArgs } from '../utils';
import {
	FormulaSchemaUnitInput,
	ISchemaMap,
	TResultType,
	TFormulaCreateInput,
	FormulaArraySchemaUnitInput,
	AnyArrayResultType
} from '../types';

function generateFormulaAST (
	input_formula: FormulaSchemaUnitInput['formula'] | FormulaArraySchemaUnitInput['formula'],
	schema_map: ISchemaMap
): TFormula {
	const output_formula = {
		args: []
	};

	function traverseFormula (parent: any, arg: TResultType | AnyArrayResultType | undefined) {
		if ((arg as TFormulaCreateInput).function || Array.isArray(arg)) {
			let function_name: TFunctionName = '' as any,
				args: any[] | undefined = undefined;
			if ((arg as TFormulaCreateInput).function) {
				function_name = (arg as TFormulaCreateInput).function;
				args = (arg as TFormulaCreateInput).args;
			} else if (Array.isArray(arg)) {
				function_name = arg[0];
				args = arg[1] as any[];
			}
			const temp_args = [] as any,
				function_formula = {
					name: function_name,
					type: 'function',
					result_type: formula_rt_map.get(function_name)
				};
			parent.push(function_formula);
			if (args) {
				(function_formula as any).args = temp_args;
				for (let index = 0; index < args.length; index++) traverseFormula(temp_args, args[index] as any);
			}
		} else if ((arg as { property: string }).property)
			parent.push(generateFormulaArgFromProperty(arg as { property: string }, schema_map));
		else parent.push(generateFormulaArgs(arg));
	}

	traverseFormula(output_formula.args, input_formula);
	return output_formula.args[0];
}

export function parseFormulaFromObject (formula: FormulaSchemaUnitInput['formula'], schema_map: ISchemaMap): TFormula {
	return generateFormulaAST(formula, schema_map);
}

export function parseFormulaFromArray (
	formula: FormulaArraySchemaUnitInput['formula'],
	schema_map: ISchemaMap
): TFormula {
	return generateFormulaAST(formula, schema_map);
}
