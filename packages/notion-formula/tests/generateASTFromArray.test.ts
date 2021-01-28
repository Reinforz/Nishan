import { parseFormulaFromArray } from '../src';
import deepEqual from 'deep-equal';
import { generateNumberFunction, generateNumberConstant } from './utils/generateFunction';

describe('Abs method should work correctly', () => {
	const abs_constant_arg_formula = generateNumberFunction('abs').arg([ generateNumberConstant(1) ]);

	it('Should work for formula array', () => {
		expect(deepEqual(abs_constant_arg_formula, parseFormulaFromArray([ 'abs', [ 1 ] ], new Map()))).toBe(true);
	});
});
