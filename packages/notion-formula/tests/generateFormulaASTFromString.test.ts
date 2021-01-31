import deepEqual from 'deep-equal';
import { generateFormulaASTFromString } from '../src';
import { test_schema_map } from './utils';

describe('String function formula parsing error', () => {
	it('Should throw for improper function argument length', () => {
		expect(() => generateFormulaASTFromString('abs(1, 2)')).toThrow(`Function abs takes 1 arguments, given 2`);
	});

	it('Should throw for improper function argument (constant) type', () => {
		expect(() => generateFormulaASTFromString('abs("1")')).toThrow(
			`Argument of type text can't be used as argument 1 for function abs`
		);
	});

	it('Should throw for improper function argument (function) type', () => {
		expect(() => generateFormulaASTFromString('abs(concat("1", "1"))')).toThrow(
			`Argument of type text can't be used as argument 1 for function abs`
		);
	});

	it('Should throw for improper function argument (property) type', () => {
		expect(() => generateFormulaASTFromString('abs(prop("text"))', test_schema_map)).toThrow(
			`Argument of type text can't be used as argument 1 for function abs`
		);
	});

	it('Should throw for improper property argument type', () => {
		expect(() => generateFormulaASTFromString('abs(prop("text"))')).toThrow(
			`A property is referenced in the formula, but schema_map argument was not passed`
		);
	});
});

describe('Variadic argument string representation parsing', () => {
	it(`Should parse correctly when passed correct types`, () => {
		expect(
			deepEqual(
				{
					name: 'max',
					type: 'function',
					args: [
						{
							type: 'constant',
							value: '1',
							value_type: 'number',
							result_type: 'number'
						},
						{
							type: 'symbol',
							name: 'e',
							result_type: 'number'
						}
					],
					result_type: 'number'
				},
				generateFormulaASTFromString('max(1, e)', test_schema_map)
			)
		).toBe(true);
	});

	it('Should throw for improper variadic argument type', () => {
		expect(() => generateFormulaASTFromString('max("1", e)')).toThrow(
			`Argument of type text can't be used as argument 1 for function max`
		);
	});
});

describe('Zero arity function formula string parsing', () => {
	it(`Should parse correctly when passed correct types`, () => {
		expect(
			deepEqual(
				{
					name: 'now',
					type: 'function',
					result_type: 'date'
				},
				generateFormulaASTFromString('now()', test_schema_map)
			)
		).toBe(true);
	});

	it('Should throw for improper zero arity function', () => {
		expect(() => generateFormulaASTFromString('now("1", e)')).toThrow(`Too many arguments in function now`);
	});
});

describe('Function formula string representation parsing success', () => {
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
				generateFormulaASTFromString('abs(1)', test_schema_map)
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
				generateFormulaASTFromString('abs(e)', test_schema_map)
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
				generateFormulaASTFromString('abs(prop("number"))', test_schema_map)
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
				generateFormulaASTFromString('abs(ceil(1))', test_schema_map)
			)
		).toBe(true);
	});
});
