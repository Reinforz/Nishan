import { GenerateNotionFormulaAST } from '../../libs';
import { abs, cn, ct, pn, pt, sc, sn, test_schema_map } from '../utils';

describe('String function formula parsing error', () => {
	it('Should throw for improper function argument length', () => {
		expect(() => GenerateNotionFormulaAST.string('abs(1, 2)')).toThrow(`Function abs takes 1 arguments, given 2`);
	});

	it('Should throw for improper function argument (constant) type', () => {
		expect(() => GenerateNotionFormulaAST.string('abs("1")')).toThrow(
			`Argument of type text can't be used as argument 1 for function abs`
		);
	});

	it('Should throw for improper function argument (function) type', () => {
		expect(() => GenerateNotionFormulaAST.string('abs(concat("1", "1"))')).toThrow(
			`Argument of type text can't be used as argument 1 for function abs`
		);
	});

	it('Should throw for improper function argument (property) type', () => {
		expect(() => GenerateNotionFormulaAST.string('abs(prop("text"))', test_schema_map)).toThrow(
			`Argument of type text can't be used as argument 1 for function abs`
		);
	});

	it('Should throw for improper property argument type', () => {
		expect(() => GenerateNotionFormulaAST.string('abs(prop("text"))')).toThrow(
			`A property is referenced in the formula, but schema_map argument was not passed`
		);
	});
});

describe('Variadic argument string representation parsing', () => {
	it(`Should parse correctly when passed correct types`, () => {
		expect({
			name: 'max',
			type: 'function',
			args: [ cn, sn ],
			result_type: 'number'
		}).toStrictEqual(GenerateNotionFormulaAST.string('max(1, e)', test_schema_map));
	});

	it('Should throw for improper variadic argument type', () => {
		expect(() => GenerateNotionFormulaAST.string('max("1", e)')).toThrow(
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
		}).toStrictEqual(GenerateNotionFormulaAST.string('now()', test_schema_map));
	});

	it('Should throw for improper zero arity function text constant argument', () => {
		expect(() => GenerateNotionFormulaAST.string('now("1")')).toThrow(`Too many arguments in function now`);
	});

	it('Should throw for improper zero arity function number constant argument', () => {
		expect(() => GenerateNotionFormulaAST.string('now(1)')).toThrow(`Too many arguments in function now`);
	});

	it('Should throw for improper zero arity function number symbol argument', () => {
		expect(() => GenerateNotionFormulaAST.string('now(e)')).toThrow(`Too many arguments in function now`);
	});

	it('Should throw for improper zero arity function checkbox symbol argument', () => {
		expect(() => GenerateNotionFormulaAST.string('now(true)')).toThrow(`Too many arguments in function now`);
	});
});

describe('Function formula string parsing success for literal arguments', () => {
	it('Should match output for number x symbol argument variant', () => {
		expect(sn).toStrictEqual(GenerateNotionFormulaAST.string('e'));
	});

	it('Should match output for checkbox x symbol argument variant', () => {
		expect(sc).toStrictEqual(GenerateNotionFormulaAST.string('true'));
	});

	it('Should match output for string x constant argument variant', () => {
		expect(ct).toStrictEqual(GenerateNotionFormulaAST.string('"text"'));
	});

	it('Should match output for string(with space) x constant argument variant', () => {
		expect({
			...ct,
			value: 'text with space'
		}).toStrictEqual(GenerateNotionFormulaAST.string('"text with space"'));
	});

	it('Should match output for number x constant argument variant', () => {
		expect(cn).toStrictEqual(GenerateNotionFormulaAST.string('1'));
	});

	it('Should match output for number x property argument variant', () => {
		expect(pn).toStrictEqual(GenerateNotionFormulaAST.string('prop("number")', test_schema_map));
	});
});

describe('Function formula string representation parsing success', () => {
	it(`Should match output for constant argument type`, () => {
		expect(abs([ cn ])).toStrictEqual(GenerateNotionFormulaAST.string('abs(1)', test_schema_map));
	});

	it(`Should match output for symbol argument type`, () => {
		expect(abs([ sn ])).toStrictEqual(GenerateNotionFormulaAST.string('abs(e)', test_schema_map));
	});

	it(`Should match output for property argument type`, () => {
		expect(abs([ pn ])).toStrictEqual(GenerateNotionFormulaAST.string('abs(prop("number"))', test_schema_map));
	});

	it(`Should match output for checkbox symbol argument type`, () => {
		expect({
			name: 'and',
			type: 'function',
			args: [ sc, sc ],
			result_type: 'checkbox'
		}).toStrictEqual(GenerateNotionFormulaAST.string('and(true, true)', test_schema_map));
	});

	it(`Should match output for function argument type`, () => {
		expect(abs([ abs([ cn ]) ])).toStrictEqual(GenerateNotionFormulaAST.string('abs(abs(1))', test_schema_map));
	});

	it(`Should match output for string x constant argument variant`, () => {
		expect({
			name: 'concat',
			type: 'function',
			args: [ ct, ct ],
			result_type: 'text'
		}).toStrictEqual(GenerateNotionFormulaAST.string('concat("text", "text")', test_schema_map));
	});

	it(`Should match output for string(with spaces) x constant argument variant`, () => {
		expect({
			name: 'concat',
			type: 'function',
			args: [
				{
					...ct,
					value: 'a space'
				},
				{
					...ct,
					value: 'b space'
				}
			],
			result_type: 'text'
		}).toStrictEqual(GenerateNotionFormulaAST.string('concat("a space", "b space")', test_schema_map));
	});
});

describe('Test parsing of special characters inside text constants', () => {
	it(`Should parse and match output correctly for [string(with space) x constant & string(with space) x property] argument variant`, () => {
		expect({
			name: 'concat',
			type: 'function',
			args: [
				{
					...ct,
					value: 'a space'
				},
				{
					...pt,
					name: 'text space'
				}
			],
			result_type: 'text'
		}).toStrictEqual(GenerateNotionFormulaAST.string('concat("a space", prop("text space"))', test_schema_map));
	});

	it(`Should parse and match output correctly for [string(with commas) x constant & string(with commas) x property] argument variant`, () => {
		expect({
			name: 'concat',
			type: 'function',
			args: [
				{
					...ct,
					value: 'a,commas'
				},
				{
					...pt,
					name: 'text,commas'
				}
			],
			result_type: 'text'
		}).toStrictEqual(GenerateNotionFormulaAST.string('concat("a,commas", prop("text,commas"))', test_schema_map));
	});

	it(`Should parse and match output correctly for [string(with left parenthesis) x constant & string(with left parenthesis) x property] argument variant`, () => {
		expect({
			name: 'concat',
			type: 'function',
			args: [
				{
					...ct,
					value: 'a(left parenthesis'
				},
				{
					...pt,
					name: 'text(left parenthesis'
				}
			],
			result_type: 'text'
		}).toStrictEqual(
			GenerateNotionFormulaAST.string('concat("a(left parenthesis", prop("text(left parenthesis"))', test_schema_map)
		);
	});

	it(`Should parse and match output correctly for [string(with right parenthesis) x constant & string(with right parenthesis) x property] argument variant`, () => {
		expect({
			name: 'concat',
			type: 'function',
			args: [
				{
					...ct,
					value: 'a)right parenthesis'
				},
				{
					...pt,
					name: 'text)right parenthesis'
				}
			],
			result_type: 'text'
		}).toStrictEqual(
			GenerateNotionFormulaAST.string('concat("a)right parenthesis", prop("text)right parenthesis"))', test_schema_map)
		);
	});
});
