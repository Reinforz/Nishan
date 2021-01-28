import { TFunctionName } from '@nishans/types';
import deepEqual from 'deep-equal';

import { parseFormulaFromObject } from '../src';
import {
	function_formula_info,
	test_schema_map,
	generateFunction,
	generateFunctionFormulaASTArguments,
	generateFunctionFormulaObjectArguments
} from './utils';

function_formula_info.forEach(({ function_name, return_type, args }) => {
	args.forEach((arg) => {
		const function_formula_ast_args = generateFunctionFormulaASTArguments(arg);
		const function_formula_arr_args = generateFunctionFormulaObjectArguments(arg);
		const non_empty_keys = Object.keys(function_formula_ast_args).filter(
			(key) => function_formula_ast_args[key].length !== 0
		);

		non_empty_keys.forEach((non_empty_key) => {
			it(`fn:${function_name} rt:${return_type} arg:${JSON.stringify(
				args.map((arg) => `${arg}.${non_empty_key}`)
			)}`, () => {
				expect(
					deepEqual(
						generateFunction(function_name as TFunctionName, return_type, function_formula_ast_args[non_empty_key]),
						parseFormulaFromObject(
							{ function: function_name as any, args: function_formula_arr_args[non_empty_key] },
							test_schema_map
						)
					)
				).toBe(true);
			});
		});
	});
});
