import { parseFormulaFromObject } from '../src';
import deepEqual from 'deep-equal';
import { generateNumberConstant, generateNumberFunction } from './utils/generateFunction';

describe('Single number argument formulas with number return type should work correctly', () => {
  // Single argument number return_type formulas
  const arg1_nrt_formula_names = [
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

	arg1_nrt_formula_names.forEach((arg1_nrt_formula_name) => {
		it(`Should work for ${arg1_nrt_formula_name} function`, () => {
			expect(
				deepEqual(
					generateNumberFunction(arg1_nrt_formula_name).arg([
            generateNumberConstant(1)
          ]),
          parseFormulaFromObject(
            {
              function: arg1_nrt_formula_name,
              args: 1
            },
            new Map()
          )
				)
			).toBe(true);
		});
	});
});