import { parseFormulaFromArray } from '../src';
import deepEqual from 'deep-equal';
import { generateFunction } from './utils/generateFormulaParts';
import { ISchemaMap } from '../types';
import { TFormulaResultType, TFunctionName } from '@nishans/types';
import { generateFunctionFormulaASTArguments, generateFunctionFormulaArrayArguments } from './utils/generateFunction';

export const function_formula_info: {
	return_type: TFormulaResultType;
	args: TFormulaResultType[][];
	function_name: TFunctionName;
}[] = [
	{
		function_name: 'abs',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'cbrt',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'unaryMinus',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'unaryPlus',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'abs',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'cbrt',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'ceil',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'exp',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'floor',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'ln',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'log10',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'log2',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'max',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'min',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'round',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'sign',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'sqrt',
		return_type: 'number',
		args: [ [ 'number' ] ]
	}
];

const schema_map: ISchemaMap = new Map([
	[ 'number', { schema_id: 'number', type: 'number', name: 'number' } ],
	[ 'text', { schema_id: 'text', type: 'text', name: 'text' } ],
	[ 'checkbox', { schema_id: 'checkbox', type: 'checkbox', name: 'checkbox' } ],
	[ 'date', { schema_id: 'date', type: 'date', name: 'date' } ]
]);

function_formula_info.forEach(({ function_name, return_type, args }) => {
	args.forEach((arg) => {
		const function_formula_ast_args = generateFunctionFormulaASTArguments(arg);
		const function_formula_arr_args = generateFunctionFormulaArrayArguments(arg);
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
						parseFormulaFromArray([ function_name as any, function_formula_arr_args[non_empty_key] ], schema_map)
					)
				).toBe(true);
			});
		});
	});
});
