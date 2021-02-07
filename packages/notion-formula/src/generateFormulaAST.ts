import { TFormula, TFormulaResultType, TFunctionFormula, TFunctionName } from '@nishans/types';
import { generateFormulaArgFromProperty, function_formula_info_map, generateFormulaArgsFromLiterals, IFunctionForumlaSignature } from '../utils';
import {
	FormulaObjectSchemaUnitInput,
	ISchemaMap,
	FormulaArraySchemaUnitInput,
  TFormulaArrayArgument,
  TFormulaObject,
  TFormulaObjectArgument,
} from '../types';
import { generateFormulaASTFromString } from './generateFormulaASTFromString';

/**
 * Generates a notion formula fully compatible with the client, using either an easier array or object representation
 * @param input_formula An object or array based notion formula
 * @param schema_map A specific schema map of the collection used to reference properties used inside the formula
 * @returns The generated formula ast
 */
export function generateFormulaAST (
	input_formula: FormulaArraySchemaUnitInput['formula'] | boolean | "e" | "pi" | string | number | {property: string},
  representation: 'array',
	schema_map?: ISchemaMap,
): TFormula;
export function generateFormulaAST (
	input_formula: FormulaObjectSchemaUnitInput['formula'] | boolean | "e" | "pi" | string | number | {property: string},
  representation: 'object',
	schema_map?: ISchemaMap,
): TFormula
export function generateFormulaAST (
	input_formula: string,
  representation: 'string',
	schema_map?: ISchemaMap,
): TFormula
export function generateFormulaAST (
	input_formula: FormulaArraySchemaUnitInput['formula'] | FormulaObjectSchemaUnitInput['formula'] | boolean | "e" | "pi" | string | number | {property: string},
  representation: 'array' | 'object' | 'string',
	schema_map?: ISchemaMap,
): TFormula {
  
  function traverseArguments (arg: TFormulaObjectArgument | TFormulaArrayArgument | undefined): TFormula {
    // Check whether an array based or object based function formula is used
		const is_arg_array_function = Array.isArray(arg),
			is_arg_object_function = (arg as TFormulaObject).function;
		if (is_arg_array_function || is_arg_object_function) {
			// The argument is a function formula, rather than a property reference or a constant|symbol
			const function_name: TFunctionName = is_arg_object_function
					? (arg as TFormulaObject).function
					: (arg as any)[0],
				input_args = is_arg_object_function ? (arg as TFormulaObject).args : (arg as any)[1];
      const arg_container = [] as any, function_info = function_formula_info_map.get(function_name);
      // Throws error when an unsupported function is used
      if(!function_info)
        throw new Error(`Function ${function_name} is not supported`);
      else{
        // Checks if the length of the argument passed matches with any of the argument length of the signatures
        const is_argument_length_mismatch = !Boolean(function_info.signatures.find((signature)=>(signature.variadic || (signature.arity as any).length === (input_args?.length ?? 0))));
        if(is_argument_length_mismatch)
          throw new Error(`Function ${function_name} takes ${Array.from(new Set(function_info.signatures.map((signature)=>(signature.arity as any).length))).join(',')} arguments, given ${input_args?.length ?? 0}`);
        
        // constructing the actual function formula ast, without the args and return_type as those depends on the passed arguments
        const function_formula_arg: TFunctionFormula = {
          name: function_name,
          type: 'function'
        } as any;

        // Go through each arguments of the function if any and pass parent function specific data used for capturing error information
        // a variable to store the signature matched with the supported one and the input passed
        let matched_signature : IFunctionForumlaSignature | undefined = undefined;
        const input_arities: TFormulaResultType[] = [], {signatures} = function_info;
        if(input_args){
          // Only add args property to the formula object if the function supports arguments
          (function_formula_arg as any).args = arg_container;
          // Iterate through each input arguments and parse those
          for (let index = 0; index < input_args.length; index++) {
            // every parsed input argument returns an object that must have a result_type 
            const parsed_argument = traverseArguments(input_args[index]);
            // Keep track of the result_type returned by the passed input arguments, to match with the available signatures later
            input_arities.push(parsed_argument.result_type);
            // finds the matched signature, its found if either one of signature takes variadic arguments or the result_type of the input and supported signature matches at every index
            matched_signature = signatures.find((signature)=>input_arities.every((input_arity, index)=>(signature.variadic || (signature.arity as any)[index]) === input_arity))
            if(!matched_signature)
              // Throw an error if the given signature doesnt match any of the allowed signatures
              throw new Error(`Argument of type ${parsed_argument.result_type} can't be used as argument ${index + 1} for function ${function_name}`)
            else
              (function_formula_arg as any).args.push(parsed_argument)
          }
        }else{
          // even if no input arguments are passed, functions like now still have a signature and they have to be extracted
          matched_signature = signatures.find(signature=>(signature as any).arity.length === 0)
        }
        // setting the result_type in the formula ast using the matched signature
        function_formula_arg.result_type = (matched_signature as IFunctionForumlaSignature).result_type
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

	return (representation === "string" && typeof input_formula === "string") ? generateFormulaASTFromString(input_formula, schema_map) : traverseArguments(input_formula);
}

/**
  * Generates a notion client compatible formula object using an easier object based representation
  * @param formula The simple object representation of the formula
  * @param schema_map A specific schema map of the collection used to reference properties used inside the formula
  * @returns The generated formula ast
 */
export function generateFormulaASTFromObject (formula: FormulaObjectSchemaUnitInput['formula'] | boolean | "e" | "pi" | string | number | {property: string}, schema_map?: ISchemaMap): TFormula {
	return generateFormulaAST(formula, 'object', schema_map);
}

/**
 * Generates a notion client compatible formula object using an easier object based representation
 * @param formula The simple array representation of the formula
 * @param schema_map A specific schema map of the collection used to reference properties used inside the formula
 * @returns The generated formula ast
 */
export function generateFormulaASTFromArray (
	formula: FormulaArraySchemaUnitInput['formula'] | boolean | "e" | "pi" | string | number | {property: string},
	schema_map?: ISchemaMap
): TFormula {
	return generateFormulaAST(formula, 'array', schema_map);
}