import { TFormula, TFormulaResultType, TFunctionName } from '@nishans/types';
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

	function traverseFormula (parent_arg_container: any, arg: TResultType | AnyArrayResultType | undefined, allowed_rt?: TFormulaResultType[], arg_no?: number, parent_function_name?: TFunctionName) {
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
        const is_argument_length_mismatch = function_info.args?.findIndex((arg_info: any)=>arg_info.length === args?.length) === -1;
        if(is_argument_length_mismatch)
          throw new Error(`Function ${function_name} takes ${function_info.args && Array.from(new Set(function_info.args.map((arg: any)=>arg.length))).join(',') || 0} arguments, given ${args?.length ?? 0}`)
        const function_formula_arg = {
          name: function_name,
          type: 'function',
          result_type: function_info.return_type
        };
        parent_arg_container.push(function_formula_arg);
        // Go through each arguments of the function if any
        if (args) {
          (function_formula_arg as any).args = arg_container;
          for (let index = 0; index < args.length; index++) {
            const allowed_rt = function_info?.args?.map((arg=>arg[index])).filter(arg=>arg) ?? undefined;
            traverseFormula(arg_container, args[index] as any, allowed_rt, index, function_name)
          };
        }
      }
		} else if ((arg as { property: string }).property) {
			if (!schema_map)
        throw new Error(`A property is referenced in the formula, but schema_map argument was not passed`);
      const property_arg = generateFormulaArgFromProperty(arg as { property: string }, schema_map);
      if(allowed_rt && !allowed_rt.includes(property_arg.result_type))
        throw new Error(`Argument of type ${property_arg.result_type} can't be used as argument ${arg_no && arg_no+ 1} for function ${parent_function_name}, allowed types for argument ${arg_no && arg_no + 1} are ${Array.from(new Set(allowed_rt)).join(',')}`)
			parent_arg_container.push(property_arg);
		} else {
      const constant_arg = generateFormulaArgsFromLiterals(arg as any);
      if(allowed_rt && !allowed_rt.includes(constant_arg.result_type))
        throw new Error(`Argument of type ${constant_arg.result_type} can't be used as argument ${arg_no && arg_no+ 1} for function ${parent_function_name}, allowed types for argument ${arg_no && arg_no + 1} are ${Array.from(new Set(allowed_rt)).join(',')}`)
      parent_arg_container.push(constant_arg)
    };
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
  // console.log(formula);
	return generateFormulaAST(formula, schema_map);
}
