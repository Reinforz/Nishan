import { TFunctionName } from '@nishans/types';
import deepEqual from 'deep-equal';

import { generateFormulaASTFromObject, generateFormulaASTFromArray } from '../src';
import { function_formula_info_arr } from '../utils';
import {
	test_schema_map,
	generateFunction,
	generateFunctionFormulaASTArguments,
	generateFunctionFormulaArrayArguments,
	generateFunctionFormulaObjectArguments
} from './utils';

function_formula_info_arr.forEach(({ function_name, return_type, args }) => {
	args.forEach((arg) => {
		const function_formula_ast_args = generateFunctionFormulaASTArguments(arg),
			function_formula_arr_args = generateFunctionFormulaArrayArguments(arg),
			function_formula_obj_args = generateFunctionFormulaObjectArguments(arg),
			arg_types = Object.keys(function_formula_ast_args).filter((key) => function_formula_ast_args[key].length !== 0);

		arg_types.forEach((arg_type) => {
			const formula_ast = generateFunction(
				function_name as TFunctionName,
				return_type,
				function_formula_ast_args[arg_type]
			);

			it(`type:array fn:${function_name} rt:${return_type} arg:${JSON.stringify(
				arg.map((arg) => `${arg}.${arg_type}`)
			)}`, () => {
				expect(
					deepEqual(
						formula_ast,
						generateFormulaASTFromArray([ function_name as any, function_formula_arr_args[arg_type] ], test_schema_map)
					)
				).toBe(true);
			});
			it(`type:obj fn:${function_name} rt:${return_type} arg:${JSON.stringify(
				arg.map((arg) => `${arg}.${arg_type}`)
			)}`, () => {
				expect(
					deepEqual(
						formula_ast,
						generateFormulaASTFromObject(
							{ function: function_name as any, args: function_formula_obj_args[arg_type] },
							test_schema_map
						)
					)
				).toBe(true);
			});
		});
	});
});
