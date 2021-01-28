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
		const arg_types = Object.keys(function_formula_ast_args).filter(
			(key) => function_formula_ast_args[key].length !== 0
		);

		arg_types.forEach((arg_type) => {
			it(`fn:${function_name} rt:${return_type} arg:${JSON.stringify(arg.map((arg) => `${arg}.${arg_type}`))}`, () => {
				expect(
					deepEqual(
						generateFunction(function_name as TFunctionName, return_type, function_formula_ast_args[arg_type]),
						parseFormulaFromObject(
							{ function: function_name as any, args: function_formula_arr_args[arg_type] },
							test_schema_map
						)
					)
				).toBe(true);
			});
		});
	});
});
