import { parseFormulaFromArray } from '../src';
import deepEqual from 'deep-equal';

describe('Abs method should work correctly', () => {
	const abs_constant_arg_formula = {
		type: 'function',
		result_type: 'number',
		name: 'abs',
		args: [
			{
				type: 'constant',
				result_type: 'number',
				value: '1',
				value_type: 'number'
			}
		]
	};

	it('Should work for formula array', () => {
		expect(deepEqual(abs_constant_arg_formula, parseFormulaFromArray([ 'abs', [ 1 ] ], new Map()))).toBe(true);
	});
});
