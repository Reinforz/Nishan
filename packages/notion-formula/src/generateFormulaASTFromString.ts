import { TFunctionName } from '@nishans/types';
import { function_formula_info_map, ISchemaMap } from '../src';
import { generateFormulaASTFromArray } from './generateFormulaAST';

/**
 * Generate notion client compatible formula ast from string 
 * @param formula The formula string required to be parsed
 * @param schema_map The schema_map used to resolve property reference
 * @returns Notion compatible formula ast
 */
export function generateFormulaASTFromString (formula: string, schema_map?: ISchemaMap) {
	let last_arg = '';
  const parents = [] as any;
  // Keep track of the current context, as "" can be part of a string constant or a property reference
  let context: 'function' | 'prop' = 'function';
  for (let index = 0; index < formula.length; index++) {
    const char = formula[index];
    // adds to the last_arg only if its not a bracket, comma
    // If the current character is a space add it if its part of of string
    const is_part_of_string = last_arg.match(/".+?/), is_special_character = char.match(/(\(|\)|,|\s)/);
    if(is_part_of_string) last_arg += char;
    else if(!is_special_character) last_arg += char;
    // checks to see if any of the argument variants matches with last_arg
    const text_constant_match = last_arg.match(/^"(.+?)"$/),
			number_constant_match = last_arg.match(/^(\d+)$/),
			number_symbol_match = last_arg.match(/^(e|pi)$/),
			checkbox_symbol_match = last_arg.match(/^(true|false)$/),
			function_match = Boolean(function_formula_info_map.get(last_arg as TFunctionName));

    // capturing the parent args container and parent function
		const parent_args = parents[parents.length - 1]?.[1],
      parent_fn = parents[parents.length - 1]?.[0];
    // Change the context if the last_arg is prop and the nexet char is (
		if (last_arg === 'prop' && formula[index+1] === '(') {
      last_arg = '';
      // change the context to prop so that the next text constant will be used as a property reference rather than an argument 
			context = 'prop';
		} else if (function_match && char === '(') {
      // a nested function formula has been detected
      parents.push([ last_arg ]);
      // only now function doesnt take in any arguments
      if (last_arg !== 'now') parents[parents.length - 1].push([]);
      // reset last_arg
      last_arg = '';
      // change the context to function so that the next text constant will be used as an argument rather than a property reference
			context = 'function';
		} else if (checkbox_symbol_match) {
      // If parent_args exists ie if the parent function takes in arguments and parents is not empty, since an argument can be standalone without any formula parent
      if (!parent_args && parents.length !== 0) throw new Error(`Too many arguments in function ${parent_fn}`);
      // Converts the last_arg to a boolean
			(parent_args ?? parents).push(checkbox_symbol_match[1] === 'true' ? true : false);
			last_arg = '';
		} else if (number_symbol_match) {
			if (!parent_args && parents.length !== 0) throw new Error(`Too many arguments in function ${parent_fn}`);
			(parent_args ?? parents).push(number_symbol_match[1]);
			last_arg = '';
		} else if (number_constant_match) {
			if (!parent_args && parents.length !== 0) throw new Error(`Too many arguments in function ${parent_fn}`);
			(parent_args ?? parents).push(Number(number_constant_match[1]));
			last_arg = '';
		} else if (text_constant_match) {
      if (!parent_args && parents.length !== 0) throw new Error(`Too many arguments in function ${parent_fn}`);
      // if the context is a function push asa a text constant argument else if its prop push as a property argument
			(parent_args ?? parents).push(context === 'function' ? text_constant_match[1] : { property: text_constant_match[1] });
			last_arg = '';
		}

		if (!is_part_of_string && char === ')') {
      // if any ) char is encountered and there is a parent and context is not a prop, 
      // append the last element of the parent stack as the last argument of the last function of the parent
			if (parents.length !== 1 && context !== 'prop') {
				const arg = parents.pop();
				parents[parents.length - 1][1].push(arg);
			} else context = 'function';
		}
  }
  
	return generateFormulaASTFromArray(parents[0], schema_map);
}
