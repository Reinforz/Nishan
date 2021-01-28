import { TFormula, TFunctionName } from '@nishans/types';
import { generateFormulaArgFromProperty, function_formula_info_map, generateFormulaArgsFromLiterals } from '../utils';
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
	schema_map?: ISchemaMap
): TFormula {
	const output_formula = {
		args: []
	};

	function traverseFormula (parent_arg_container: any, arg: TResultType | AnyArrayResultType | undefined) {
		const is_arg_array_function = Array.isArray(arg),
			is_arg_object_function = (arg as TFormulaCreateInput).function;
		if (is_arg_array_function || is_arg_object_function) {
			// The argument is a function
			const function_name: TFunctionName = is_arg_object_function
					? (arg as TFormulaCreateInput).function
					: (arg as any)[0],
				args: any[] | undefined = is_arg_object_function ? (arg as TFormulaCreateInput).args : (arg as any)[1];
      const arg_container = [] as any, function_info = function_formula_info_map.get(function_name);
      if(!function_info)
        throw new Error(`Function ${function_name} is not supported`);
      else{
        const is_argument_length_mismatch = function_info.args.findIndex(arg_info=>arg_info.length === args?.length) === -1;
        if(is_argument_length_mismatch)
          throw new Error(`Function ${function_name} takes ${Array.from(new Set(function_info.args.map(arg=>arg.length))).join(',')} arguments, given ${args?.length ?? 0}`)
        const function_formula = {
          name: function_name,
          type: 'function',
          result_type: function_info.return_type
        };
        parent_arg_container.push(function_formula);
        // Go through each arguments of the function if any
        if (args) {
          (function_formula as any).args = arg_container;
          for (let index = 0; index < args.length; index++) traverseFormula(arg_container, args[index] as any);
        }
      }
		} else if ((arg as { property: string }).property) {
			if (!schema_map)
				throw new Error(`A property is referenced in the formula, but schema_map argument was not passed`);
			parent_arg_container.push(generateFormulaArgFromProperty(arg as { property: string }, schema_map));
		} else parent_arg_container.push(generateFormulaArgsFromLiterals(arg as any));
	}

	traverseFormula(output_formula.args, input_formula);
	return output_formula.args[0];
}

export function generateFormulaASTFromObject (formula: FormulaSchemaUnitInput['formula'], schema_map?: ISchemaMap): TFormula {
	return generateFormulaAST(formula, schema_map);
}

export function generateFormulaASTFromArray (
	formula: FormulaArraySchemaUnitInput['formula'],
	schema_map?: ISchemaMap
): TFormula {
	return generateFormulaAST(formula, schema_map);
}
