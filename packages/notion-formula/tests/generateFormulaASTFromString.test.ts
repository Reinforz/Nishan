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
		expect({
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
		}).toStrictEqual(generateFormulaASTFromString('max(1, e)', test_schema_map));
	});

	it('Should throw for improper variadic argument type', () => {
		expect(() => generateFormulaASTFromString('max("1", e)')).toThrow(
			`Argument of type text can't be used as argument 1 for function max`
		);
	});
});

describe('Zero arity function formula string parsing', () => {
	it(`Should parse correctly when passed correct types`, () => {
		expect({
			name: 'now',
			type: 'function',
			result_type: 'date'
		}).toStrictEqual(generateFormulaASTFromString('now()', test_schema_map));
	});

	it('Should throw for improper zero arity function text constant argument', () => {
		expect(() => generateFormulaASTFromString('now("1")')).toThrow(`Too many arguments in function now`);
	});

	it('Should throw for improper zero arity function number constant argument', () => {
		expect(() => generateFormulaASTFromString('now(1)')).toThrow(`Too many arguments in function now`);
	});

	it('Should throw for improper zero arity function number symbol argument', () => {
		expect(() => generateFormulaASTFromString('now(e)')).toThrow(`Too many arguments in function now`);
	});

	it('Should throw for improper zero arity function checkbox symbol argument', () => {
		expect(() => generateFormulaASTFromString('now(true)')).toThrow(`Too many arguments in function now`);
	});
});

describe('Function formula string parsing success for literal arguments', () => {
	it('Should match output for number x symbol argument variant', () => {
		expect({
			type: 'symbol',
			name: 'e',
			result_type: 'number'
		}).toStrictEqual(generateFormulaASTFromString('e'));
	});

	it('Should match output for checkbox x symbol argument variant', () => {
		expect({
			type: 'symbol',
			name: 'true',
			result_type: 'checkbox'
		}).toStrictEqual(generateFormulaASTFromString('true'));
	});

	it('Should match output for string x constant argument variant', () => {
		expect({
			type: 'constant',
			value: 'text',
			result_type: 'text',
			value_type: 'string'
		}).toStrictEqual(generateFormulaASTFromString('"text"'));
	});

	it('Should match output for string(with space) x constant argument variant', () => {
		expect({
			type: 'constant',
			value: 'text with space',
			result_type: 'text',
			value_type: 'string'
		}).toStrictEqual(generateFormulaASTFromString('"text with space"'));
	});

	it('Should match output for number x constant argument variant', () => {
		expect({
			type: 'constant',
			value: '1',
			result_type: 'number',
			value_type: 'number'
		}).toStrictEqual(generateFormulaASTFromString('1'));
	});

	it('Should match output for number x property argument variant', () => {
		expect({
			type: 'property',
			name: 'number',
			id: 'number',
			result_type: 'number'
		}).toStrictEqual(generateFormulaASTFromString('prop("number")', test_schema_map));
	});
});

describe('Function formula string representation parsing success', () => {
	it(`Should match output for constant argument type`, () => {
		expect({
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
		}).toStrictEqual(generateFormulaASTFromString('abs(1)', test_schema_map));
	});

	it(`Should match output for symbol argument type`, () => {
		expect({
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
		}).toStrictEqual(generateFormulaASTFromString('abs(e)', test_schema_map));
	});

	it(`Should match output for property argument type`, () => {
		expect({
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
		}).toStrictEqual(generateFormulaASTFromString('abs(prop("number"))', test_schema_map));
	});

	it(`Should match output for checkbox symbol argument type`, () => {
		expect({
			name: 'and',
			type: 'function',
			args: [
				{
					type: 'symbol',
					name: 'true',
					result_type: 'checkbox'
				},
				{
					type: 'symbol',
					name: 'false',
					result_type: 'checkbox'
				}
			],
			result_type: 'checkbox'
		}).toStrictEqual(generateFormulaASTFromString('and(true, false)', test_schema_map));
	});

	it(`Should match output for function argument type`, () => {
		expect({
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
		}).toStrictEqual(generateFormulaASTFromString('abs(ceil(1))', test_schema_map));
	});

	it(`Should match output for string x constant argument variant`, () => {
		expect({
			name: 'concat',
			type: 'function',
			args: [
				{
					type: 'constant',
					value: 'a',
					value_type: 'string',
					result_type: 'text'
				},
				{
					type: 'constant',
					value: 'b',
					value_type: 'string',
					result_type: 'text'
				}
			],
			result_type: 'text'
		}).toStrictEqual(generateFormulaASTFromString('concat("a", "b")', test_schema_map));
	});

	it(`Should match output for string(with spaces) x constant argument variant`, () => {
		expect({
			name: 'concat',
			type: 'function',
			args: [
				{
					type: 'constant',
					value: 'a space',
					value_type: 'string',
					result_type: 'text'
				},
				{
					type: 'constant',
					value: 'b space',
					value_type: 'string',
					result_type: 'text'
				}
			],
			result_type: 'text'
		}).toStrictEqual(generateFormulaASTFromString('concat("a space", "b space")', test_schema_map));
	});
});

describe('Test parsing of special characters inside text constants', () => {
	it(`Should parse and match output correctly for [string(with space) x constant & string(with space) x property] argument variant`, () => {
		expect({
			name: 'concat',
			type: 'function',
			args: [
				{
					type: 'constant',
					value: 'a space',
					value_type: 'string',
					result_type: 'text'
				},
				{
					type: 'property',
					id: 'text',
					name: 'text space',
					result_type: 'text'
				}
			],
			result_type: 'text'
		}).toStrictEqual(generateFormulaASTFromString('concat("a space", prop("text space"))', test_schema_map));
	});

	it(`Should parse and match output correctly for [string(with commas) x constant & string(with commas) x property] argument variant`, () => {
		expect({
			name: 'concat',
			type: 'function',
			args: [
				{
					type: 'constant',
					value: 'a,commas',
					value_type: 'string',
					result_type: 'text'
				},
				{
					type: 'property',
					id: 'text',
					name: 'text,commas',
					result_type: 'text'
				}
			],
			result_type: 'text'
		}).toStrictEqual(generateFormulaASTFromString('concat("a,commas", prop("text,commas"))', test_schema_map));
	});

	it(`Should parse and match output correctly for [string(with left parenthesis) x constant & string(with left parenthesis) x property] argument variant`, () => {
		expect({
			name: 'concat',
			type: 'function',
			args: [
				{
					type: 'constant',
					value: 'a(left parenthesis',
					value_type: 'string',
					result_type: 'text'
				},
				{
					type: 'property',
					id: 'text',
					name: 'text(left parenthesis',
					result_type: 'text'
				}
			],
			result_type: 'text'
		}).toStrictEqual(
			generateFormulaASTFromString('concat("a(left parenthesis", prop("text(left parenthesis"))', test_schema_map)
		);
	});

	it(`Should parse and match output correctly for [string(with right parenthesis) x constant & string(with right parenthesis) x property] argument variant`, () => {
		expect({
			name: 'concat',
			type: 'function',
			args: [
				{
					type: 'constant',
					value: 'a)right parenthesis',
					value_type: 'string',
					result_type: 'text'
				},
				{
					type: 'property',
					id: 'text',
					name: 'text)right parenthesis',
					result_type: 'text'
				}
			],
			result_type: 'text'
		}).toStrictEqual(
			generateFormulaASTFromString('concat("a)right parenthesis", prop("text)right parenthesis"))', test_schema_map)
		);
	});
});
