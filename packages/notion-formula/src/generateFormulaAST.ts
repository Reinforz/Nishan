import { TFormula, TFormulaResultType, TFunctionFormula, TFunctionName } from '@nishans/types';
import { generateFormulaArgFromProperty, function_formula_info_map, generateFormulaArgsFromLiterals, IFunctionForumlaSignature } from '../utils';
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
	function traverseArguments (arg: TResultType | AnyArrayResultType | undefined): TFormula {
    // Check whether an array based or object based function formula is used
		const is_arg_array_function = Array.isArray(arg),
			is_arg_object_function = (arg as TFormulaCreateInput).function;
		if (is_arg_array_function || is_arg_object_function) {
			// The argument is a function formula
			const function_name: TFunctionName = is_arg_object_function
					? (arg as TFormulaCreateInput).function
					: (arg as any)[0],
				input_args = is_arg_object_function ? (arg as TFormulaCreateInput).args : (arg as any)[1];
      const arg_container = [] as any, function_info = function_formula_info_map.get(function_name);
      // Throws error when an invalid function is used
      if(!function_info)
        throw new Error(`Function ${function_name} is not supported`);
      else{
        // Checks if the number of arguments, supported by the function matches with the passed representation
        const is_argument_length_mismatch = !Boolean(function_info.signatures.find((signature)=>(signature?.variadic || signature.arity?.length === 0 || signature.arity?.length === input_args?.length)));
        if(is_argument_length_mismatch)
          throw new Error(`Function ${function_name} takes ${Array.from(new Set(function_info.signatures.map((signature)=>signature?.arity?.length))).join(',') || 0} arguments, given ${input_args?.length ?? 0}`)
        const function_formula_arg: TFunctionFormula = {
          name: function_name,
          type: 'function'
        } as any;

        // Go through each arguments of the function if any and pass parent function specific data used for capturing error information
        // since now take no arguments there is no need to even go any further into parsing arguments
        if(input_args && function_name !== "now"){
          (function_formula_arg as any).args = arg_container;
          const input_arities: TFormulaResultType[] = [],
            {signatures} = function_info;
          let matched_signature : IFunctionForumlaSignature | undefined = undefined;
          for (let index = 0; index < input_args.length; index++) {
            const parsed_argument = traverseArguments(input_args[index]);
            input_arities.push(parsed_argument.result_type);
            matched_signature = signatures.find((signature)=>input_arities.every((input_arity, index)=>signature?.arity?.[index] === input_arity))
            if(!matched_signature)
              // Throw an error if the given signature doesnt match any of the allowed signatures
              throw new Error(`Argument of type ${parsed_argument.result_type} can't be used as argument ${index + 1} for function ${function_name}`)
            else
              (function_formula_arg as any).args.push(parsed_argument)
          };
          function_formula_arg.result_type = (matched_signature as IFunctionForumlaSignature).result_type
        }else
          function_formula_arg.result_type = "date"

        return function_formula_arg;
      }
    }
    // The argument is a property reference 
    else if ((arg as { property: string }).property) {
      // If a schema_map is not provided but a property of the schema is referenced, throw an error, as the schema_map is required to deduce information for that specific property argument
			if (!schema_map)
        throw new Error(`A property is referenced in the formula, but schema_map argument was not passed`);
      return generateFormulaArgFromProperty(arg as { property: string }, schema_map);
		} else 
      return generateFormulaArgsFromLiterals(arg as any);
	}

	return traverseArguments(input_formula);
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
