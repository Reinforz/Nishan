import deepEqual from 'deep-equal';

import { generateFormulaASTFromArray } from '../src';
import { test_schema_map } from './utils';

describe('Function formula parsing error', () => {
	it(`Should throw for using unknown function`, () => {
		expect(() => generateFormulaASTFromArray([ 'unknown' ] as any, test_schema_map)).toThrow();
	});

	it('Should throw for improper function argument length', () => {
		expect(() => generateFormulaASTFromArray([ 'abs', [ 1, 2 ] as any ])).toThrow(
			`Function abs takes 1 arguments, given 2`
		);
	});

	it('Should throw for improper function argument (constant) type', () => {
		expect(() => generateFormulaASTFromArray([ 'abs', [ '1' ] as any ])).toThrow(
			`Argument of type text can't be used as argument 1 for function abs`
		);
	});

	it('Should throw for improper function argument (function) type', () => {
		expect(() => generateFormulaASTFromArray([ 'abs', [ [ 'ceil', '1' ] ] as any ])).toThrow(
			`Argument of type text can't be used as argument 1 for function ceil`
		);
	});
});

describe('Function formula parsing success', () => {
	it(`Should match output for constant argument type`, () => {
		expect(
			deepEqual(
				{
					name: 'abs',
					type: 'function',
					args: [
						{
							type: 'constant',
							value: '1',
							value_type: 'number',
							result_type: 'number'
						}
					],
					result_type: 'number'
				},
				generateFormulaASTFromArray([ 'abs', [ 1 ] ], test_schema_map)
			)
		).toBe(true);
	});

	it(`Should match output for symbol argument type`, () => {
		expect(
			deepEqual(
				{
					name: 'abs',
					type: 'function',
					args: [
						{
							type: 'symbol',
							name: 'e',
							result_type: 'number'
						}
					],
					result_type: 'number'
				},
				generateFormulaASTFromArray([ 'abs', [ 'e' ] ], test_schema_map)
			)
		).toBe(true);
	});

	it(`Should match output for property argument type`, () => {
		expect(
			deepEqual(
				{
					name: 'abs',
					type: 'function',
					args: [
						{
							type: 'property',
							name: 'number',
							id: 'number',
							result_type: 'number'
						}
					],
					result_type: 'number'
				},
				generateFormulaASTFromArray([ 'abs', [ { property: 'number' } ] ], test_schema_map)
			)
		).toBe(true);
	});

	it(`Should match output for function argument type`, () => {
		expect(
			deepEqual(
				{
					name: 'abs',
					type: 'function',
					args: [
						{
							name: 'ceil',
							type: 'function',
							args: [
								{
									type: 'constant',
									value: '1',
									value_type: 'number',
									result_type: 'number'
								}
							],
							result_type: 'number'
						}
					],
					result_type: 'number'
				},
				generateFormulaASTFromArray([ 'abs', [ [ 'ceil', [ 1 ] ] ] ], test_schema_map)
			)
		).toBe(true);
	});
});
