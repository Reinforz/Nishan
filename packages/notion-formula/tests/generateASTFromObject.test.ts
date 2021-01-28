import { parseFormulaFromObject } from '../src';
import deepEqual from 'deep-equal';
import { generateNumberConstant, generateNumberFunction } from './utils/generateFunction';

describe('Abs method should work correctly', () => {
	const abs_constant_arg_formula = generateNumberFunction('abs').arg([ generateNumberConstant(1) ]);

	it('Should work for formula object', () => {
		expect(
			deepEqual(
				abs_constant_arg_formula,
				parseFormulaFromObject(
					{
						function: 'abs',
						args: 1
					},
					new Map()
				)
			)
		).toBe(true);
	});
});
