import { ISchemaMap, function_formula_info_map } from '../src';
import { generateFormulaASTFromArray } from './generateFormulaAST';

export function generateFormulaASTFromString (formula: string, schema_map?: ISchemaMap) {
	let last_arg: any = '';
	const parents = [] as any;
	let context = 'function';
	for (const char of formula) {
		const text_constant_match = last_arg.match(/^"(\w+)"$/),
			number_constant_match = last_arg.match(/^(\d+)$/),
			number_symbol_match = last_arg.match(/^(e|pi)$/),
			checkbox_symbol_match = last_arg.match(/^(true|false)$/),
			function_match = Boolean(function_formula_info_map.get(last_arg));
		if (last_arg === 'prop' && char === '(') {
			last_arg = '';
			context = 'prop';
		} else if (function_match && char === '(') {
			parents.push([ last_arg, [] ]);
			last_arg = '';
			context = 'function';
		} else if (checkbox_symbol_match) {
			parents[parents.length - 1][1].push(checkbox_symbol_match[1] === 'true' ? true : false);
			last_arg = '';
		} else if (number_symbol_match) {
			parents[parents.length - 1][1].push(number_symbol_match[1]);
			last_arg = '';
		} else if (number_constant_match) {
			parents[parents.length - 1][1].push(Number(number_constant_match[1]));
			last_arg = '';
		} else if (text_constant_match) {
			parents[parents.length - 1][1].push(
				context === 'function' ? text_constant_match[1] : { property: text_constant_match[1] }
			);
			last_arg = '';
		}

		if (char === ')') {
			if (parents.length !== 1 && context !== 'prop') {
				const arg = parents.pop();
				parents[parents.length - 1][1].push(arg);
			} else context = 'function';
		}
		if (!char.match(/(\(|\)|,|\s)/)) last_arg += char;
	}
	return generateFormulaASTFromArray(parents[0], schema_map);
}
