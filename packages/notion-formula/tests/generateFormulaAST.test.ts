import { TFunctionName } from '@nishans/types';
import deepEqual from 'deep-equal';

import { generateFormulaASTFromObject, generateFormulaASTFromArray } from '../src';
import { function_formula_info_arr } from '../utils';
import { test_schema_map, generateFunction, generateFunctionFormulaArguments } from './utils';

it('Throws error for using unsupported function', () => {
	expect(() => generateFormulaASTFromArray([ 'absa', [ 1 ] ] as any, test_schema_map)).toThrow();
	expect(() => generateFormulaASTFromObject({ function: 'absa', args: [ 1 ] } as any, test_schema_map)).toThrow();
});

function_formula_info_arr.forEach(({ function_name, signatures }) => {
	signatures.forEach((signature) => {
		const function_formula_ast_args = generateFunctionFormulaArguments(signature.arity),
			function_formula_arr_args = generateFunctionFormulaArrayArguments(signature.arity),
			// function_formula_obj_args = generateFunctionFormulaObjectArguments(signature.arity),
			arg_types = Object.keys(function_formula_ast_args).filter(
				(key) => function_formula_ast_args[key].length === arg.length
			);
		// Loading with extra arguments so to force argument length mismatch error
		// function_formula_arr_wrong_args = generateFunctionFormulaArrayArguments(arg.concat(...Array(3).fill(args[0]))),
		// function_formula_obj_wrong_args = generateFunctionFormulaObjectArguments(arg.concat(...Array(3).fill(args[0])));
		arg_types.forEach((arg_type) => {
			const formula_ast = generateFunction(
				function_name as TFunctionName,
				return_type,
				function_formula_ast_args[arg_type]
			);

			// if (function_formula_arr_wrong_args[arg_type].length !== arg.length) {
			// 	it(`type:array fn:${function_name} should throw error for mismatched ${arg_type} argument`, () => {
			// 		expect(() =>
			// 			generateFormulaASTFromArray(
			// 				[ function_name as any, function_formula_arr_wrong_args[arg_type] ],
			// 				test_schema_map
			// 			)
			// 		).toThrow();
			// 	});
			// }

			// if (function_formula_obj_wrong_args[arg_type].length !== arg.length) {
			// 	it(`type:object fn:${function_name} should throw error for mismatched ${arg_type} argument`, () => {
			// 		expect(() =>
			// 			generateFormulaASTFromObject(
			// 				{ function: function_name as any, args: function_formula_obj_wrong_args[arg_type] },
			// 				test_schema_map
			// 			)
			// 		).toThrow();
			// 	});
			// }

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

			/* it(`type:obj fn:${function_name} rt:${return_type} arg:${JSON.stringify(
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
			}); */
		});
	});
});
