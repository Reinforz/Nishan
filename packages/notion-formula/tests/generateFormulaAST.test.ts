import deepEqual from 'deep-equal';

import { generateFormulaASTFromArray, generateFormulaASTFromObject } from '../src';
import { test_schema_map } from './utils';

describe('Function formula parsing error', () => {
	it(`Should throw for using unknown function`, () => {
		expect(() => generateFormulaASTFromArray([ 'unknown' ] as any, test_schema_map)).toThrow();
	});

	it('Should throw for more function arguments', () => {
		expect(() => generateFormulaASTFromArray([ 'abs', [ 1, 2 ] as any ])).toThrow(
			`Function abs takes 1 arguments, given 2`
		);
	});

	it('Should throw for fewer function arguments', () => {
		expect(() => generateFormulaASTFromArray([ 'abs' ] as any)).toThrow(`Function abs takes 1 arguments, given 0`);
	});

	it('Should throw for improper function argument (constant) type', () => {
		expect(() => generateFormulaASTFromArray([ 'abs', [ '1' ] as any ])).toThrow(
			`Argument of type text can't be used as argument 1 for function abs`
		);
	});

	it('Should throw for improper function argument (function) type', () => {
		expect(() => generateFormulaASTFromArray([ 'abs', [ [ 'concat', '1', '1' ] ] as any ])).toThrow(
			`Argument of type text can't be used as argument 1 for function abs`
		);
	});

	it('Should throw for improper function argument (property) type', () => {
		expect(() => generateFormulaASTFromArray([ 'abs', [ { property: 'text' } ] as any ], test_schema_map)).toThrow(
			`Argument of type text can't be used as argument 1 for function abs`
		);
	});

	it('Should throw for improper property argument type', () => {
		expect(() => generateFormulaASTFromArray([ 'abs', [ { property: 'text' } ] as any ])).toThrow(
			`A property is referenced in the formula, but schema_map argument was not passed`
		);
	});
});

describe('Variadic argument array representation parsing', () => {
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
				generateFormulaASTFromObject({ function: 'max', args: [ 1, 'e' ] }, test_schema_map)
			)
		).toBe(true);
	});

	it('Should throw for improper variadic argument type', () => {
		expect(() => generateFormulaASTFromArray([ 'max', [ '1', 'e' ] as any ])).toThrow(
			`Argument of type text can't be used as argument 1 for function max`
		);
	});
});

describe('Zero arity function parsing', () => {
	it(`Should parse correctly when passed correct types`, () => {
		expect(
			deepEqual(
				{
					name: 'now',
					type: 'function',
					result_type: 'date'
				},
				generateFormulaASTFromObject({ function: 'now' }, test_schema_map)
			)
		).toBe(true);
	});

	it('Should throw for improper zero arity function', () => {
		expect(() => generateFormulaASTFromArray([ 'now', [ '1', 'e' ] ] as any)).toThrow(
			`Function now takes 0 arguments, given 2`
		);
	});
});

describe('Function formula parsing success for literal arguments', () => {
	it('Should match output for number x symbol argument variant', () => {
		expect(
			deepEqual(
				{
					type: 'symbol',
					name: 'e',
					result_type: 'number'
				},
				generateFormulaASTFromObject('e')
			)
		).toBe(true);
	});

	it('Should match output for checkbox x symbol argument variant', () => {
		expect(
			deepEqual(
				{
					type: 'symbol',
					name: 'true',
					result_type: 'checkbox'
				},
				generateFormulaASTFromObject(true)
			)
		).toBe(true);
	});

	it('Should match output for string x constant argument variant', () => {
		expect(
			deepEqual(
				{
					type: 'constant',
					value: 'text',
					result_type: 'text',
					value_type: 'string'
				},
				generateFormulaASTFromObject('text')
			)
		).toBe(true);
	});

	it('Should match output for number x constant argument variant', () => {
		expect(
			deepEqual(
				{
					type: 'constant',
					value: '1',
					result_type: 'number',
					value_type: 'number'
				},
				generateFormulaASTFromObject(1)
			)
		).toBe(true);
	});

	it('Should match output for number x property argument variant', () => {
		expect(
			deepEqual(
				{
					type: 'property',
					name: 'number',
					id: 'number',
					result_type: 'number'
				},
				generateFormulaASTFromObject({ property: 'number' }, test_schema_map)
			)
		).toBe(true);
	});
});

describe('Function formula object representation parsing success for function argument', () => {
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
				generateFormulaASTFromObject({ function: 'abs', args: [ 1 ] }, test_schema_map)
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
				generateFormulaASTFromObject({ function: 'abs', args: [ 'e' ] }, test_schema_map)
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
				generateFormulaASTFromObject({ function: 'abs', args: [ { property: 'number' } ] }, test_schema_map)
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
				generateFormulaASTFromObject({ function: 'abs', args: [ { function: 'ceil', args: [ 1 ] } ] }, test_schema_map)
			)
		).toBe(true);
	});
});

describe('Function formula array representation parsing success', () => {
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
