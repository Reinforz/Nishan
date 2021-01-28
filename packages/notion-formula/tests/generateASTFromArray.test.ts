import { parseFormulaFromArray } from '../src';
import deepEqual from 'deep-equal';
import { generateFunction } from './utils/generateFormulaParts';
import { ISchemaMap } from '../types';
import { TFormulaResultType, TFunctionName } from '@nishans/types';
import { generateFunctionFormulaASTArguments, generateFunctionFormulaArrayArguments } from './utils/generateFunction';

export const function_formula_info: Record<
	TFunctionName,
	{
		return_type: TFormulaResultType;
		args: TFormulaResultType[][];
	}
> = {
	abs: {
		return_type: 'number',
		args: [ [ 'number' ] ]
	}
} as any;

const schema_map: ISchemaMap = new Map([
	[ 'number', { schema_id: 'number', type: 'number', name: 'number' } ],
	[ 'text', { schema_id: 'text', type: 'text', name: 'text' } ],
	[ 'checkbox', { schema_id: 'checkbox', type: 'checkbox', name: 'checkbox' } ],
	[ 'date', { schema_id: 'date', type: 'date', name: 'date' } ]
]);

Object.entries(function_formula_info).forEach(([ function_name, { return_type, args } ]) => {
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

/* describe('Single number argument formulas with number return type should work correctly for array ast', () => {
  // Single number argument number return_type formulas
  const narg1_nrt_formula_names = [
		'unaryMinus',
		'unaryPlus',
		'abs',
		'cbrt',
		'ceil',
		'exp',
		'floor',
		'ln',
		'log10',
		'log2',
		'max',
		'min',
		'round',
		'sign',
    'sqrt',
  ] as const;

	narg1_nrt_formula_names.forEach((narg1_nrt_formula_name) => {
		it(`Should work for ${narg1_nrt_formula_name} function when argument is number constant`, () => {
			expect(
				deepEqual(
					generateNumberFunction(narg1_nrt_formula_name, [
            generateNumberConstant(1)
          ]),
					parseFormulaFromArray([ narg1_nrt_formula_name, [ 1 ] ] as any, schema_map)
				)
			).toBe(true);
		});
  });
  
  narg1_nrt_formula_names.forEach((narg1_nrt_formula_name) => {
		it(`Should work for ${narg1_nrt_formula_name} function when argument is number function`, () => {
			expect(
				deepEqual(
					generateNumberFunction(narg1_nrt_formula_name, [
            generateNumberFunction('abs', [generateNumberConstant(1)])
          ]),
					parseFormulaFromArray([ narg1_nrt_formula_name, [['abs', [ 1 ]]] ] as any, schema_map)
				)
			).toBe(true);
		});
  });
  
  narg1_nrt_formula_names.forEach((narg1_nrt_formula_name) => {
		it(`Should work for ${narg1_nrt_formula_name} function when argument is number property`, () => {
			expect(
				deepEqual(
					generateNumberFunction(narg1_nrt_formula_name, [ generateNumberProperty('number')]),
					parseFormulaFromArray([ narg1_nrt_formula_name, [{property: "number"} ] ] as any, schema_map)
				)
			).toBe(true);
		});
  });
}); */
