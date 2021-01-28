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

/**
 * Generates a notion formula fully compatible with the client, using either an easier array or object representation
 * @param input_formula An object or array based notion formula
 * @param schema_map A specific schema map of the collection used to reference properties used inside the formula
 * @returns The generated formula ast
 */
function generateFormulaAST (
	input_formula: FormulaSchemaUnitInput['formula'] | FormulaArraySchemaUnitInput['formula'],
	schema_map?: ISchemaMap
): TFormula {
	const output_formula = {
		args: []
	};

	function traverseFormula (parent_arg_container: any, arg: TResultType | AnyArrayResultType | undefined, allowed_rt?: TFormulaResultType[], arg_no?: number, parent_function_name?: TFunctionName) {
    // Check whether an array based or object based function formula is used
		const is_arg_array_function = Array.isArray(arg),
			is_arg_object_function = (arg as TFormulaCreateInput).function;
		if (is_arg_array_function || is_arg_object_function) {
			// The argument is a function formula
			const function_name: TFunctionName = is_arg_object_function
					? (arg as TFormulaCreateInput).function
					: (arg as any)[0],
				args: any[] | undefined = is_arg_object_function ? (arg as TFormulaCreateInput).args : (arg as any)[1];
      const arg_container = [] as any, function_info = function_formula_info_map.get(function_name);
      // Throws error when an invalid function is used
      if(!function_info)
        throw new Error(`Function ${function_name} is not supported`);
      else{
        // Checks if the number of arguments, supported by the function matches with the passed representation 
        const is_argument_length_mismatch = function_info.args?.findIndex((arg_info: any)=>arg_info.length === args?.length) === -1;
        if(is_argument_length_mismatch)
          throw new Error(`Function ${function_name} takes ${function_info.args && Array.from(new Set(function_info.args.map((arg: any)=>arg.length))).join(',') || 0} arguments, given ${args?.length ?? 0}`)
        const function_formula_arg = {
          name: function_name,
          type: 'function',
          result_type: function_info.return_type
        };
        parent_arg_container.push(function_formula_arg);
        // Go through each arguments of the function if any and pass parent function specific data used for capturing error information
        if (args) {
          (function_formula_arg as any).args = arg_container;
          for (let index = 0; index < args.length; index++) {
            const allowed_rt = function_info.args?.map((arg=>arg[index])).filter(arg=>arg) ?? undefined;
            traverseFormula(arg_container, args[index] as any, allowed_rt, index, function_name)
          };
        }
      }
    }
    // The argument is a property reference 
    else if ((arg as { property: string }).property) {
      // If a schema_map is not provided but a property of the schema is referenced, throw an error, as the schema_map is required to deduce information for that specific property argument
			if (!schema_map)
        throw new Error(`A property is referenced in the formula, but schema_map argument was not passed`);
      const property_arg = generateFormulaArgFromProperty(arg as { property: string }, schema_map);
      // Throw an error if the return type of the property referenced does not match with the type of the positional argument type allowed
      if(allowed_rt && !allowed_rt.includes(property_arg.result_type))
        throw new Error(`Argument of type ${property_arg.result_type} can't be used as argument ${arg_no && arg_no+ 1} for function ${parent_function_name}, allowed types for argument ${arg_no && arg_no + 1} are ${Array.from(new Set(allowed_rt)).join(',')}`)
			parent_arg_container.push(property_arg);
		} else {
      const constant_arg = generateFormulaArgsFromLiterals(arg as any);
      // Throw an error if the return type of the literal ie symbol and constants, does not match with the type of the positional argument type allowed
      if(allowed_rt && !allowed_rt.includes(constant_arg.result_type))
        throw new Error(`Argument of type ${constant_arg.result_type} can't be used as argument ${arg_no && arg_no+ 1} for function ${parent_function_name}, allowed types for argument ${arg_no && arg_no + 1} are ${Array.from(new Set(allowed_rt)).join(',')}`)
      parent_arg_container.push(constant_arg)
    };
	}

	traverseFormula(output_formula.args, input_formula);
	return output_formula.args[0];
}

/**
  * Generates a notion client compatible formula object using an easier object based representation
  * @param formula The simple object representation of the formula
  * @param schema_map A specific schema map of the collection used to reference properties used inside the formula
  * @returns The generated formula ast
 */
export function generateFormulaASTFromObject (formula: FormulaSchemaUnitInput['formula'], schema_map?: ISchemaMap): TFormula {
	return generateFormulaAST(formula, schema_map);
}

/**
 * Generates a notion client compatible formula object using an easier object based representation
 * @param formula The simple array representation of the formula
 * @param schema_map A specific schema map of the collection used to reference properties used inside the formula
 * @returns The generated formula ast
 */
export function generateFormulaASTFromArray (
	formula: FormulaArraySchemaUnitInput['formula'],
	schema_map?: ISchemaMap
): TFormula {
	return generateFormulaAST(formula, schema_map);
}
