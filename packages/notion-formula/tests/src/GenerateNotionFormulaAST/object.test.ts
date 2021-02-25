import { GenerateNotionFormulaAST } from '../../../src';
import { abs, cn, ct, pn, sc, sn, test_schema_map } from '../utils';

describe('Zero arity function parsing', () => {
	it(`Should parse correctly when passed correct types`, () => {
		expect({
			name: 'now',
			type: 'function',
			result_type: 'date'
		}).toStrictEqual(GenerateNotionFormulaAST.object({ function: 'now' }, test_schema_map));
	});
});

describe('Variadic argument array representation parsing', () => {
	it(`Should parse correctly when passed correct types`, () => {
		expect({
			name: 'max',
			type: 'function',
			args: [ cn, sn ],
			result_type: 'number'
		}).toStrictEqual(GenerateNotionFormulaAST.object({ function: 'max', args: [ 1, 'e' ] }, test_schema_map));
	});
});

describe('Function formula parsing success for literal arguments', () => {
	it('Should match output for number x symbol argument variant', () => {
		expect(sn).toStrictEqual(GenerateNotionFormulaAST.object('e'));
	});

	it('Should match output for checkbox x symbol argument variant', () => {
		expect(sc).toStrictEqual(GenerateNotionFormulaAST.object(true));
	});

	it('Should match output for string x constant argument variant', () => {
		expect(ct).toStrictEqual(GenerateNotionFormulaAST.object('text'));
	});

	it('Should match output for number x constant argument variant', () => {
		expect(cn).toStrictEqual(GenerateNotionFormulaAST.object(1));
	});

	it('Should match output for number x property argument variant', () => {
		expect(pn).toStrictEqual(GenerateNotionFormulaAST.object({ property: 'number' }, test_schema_map));
	});
});

describe('Function formula object representation parsing success for function argument', () => {
	it(`Should match output for constant argument type`, () => {
		expect(abs([ cn ])).toStrictEqual(
			GenerateNotionFormulaAST.object({ function: 'abs', args: [ 1 ] }, test_schema_map)
		);
	});

	it(`Should match output for symbol argument type`, () => {
		expect(abs([ sn ])).toStrictEqual(
			GenerateNotionFormulaAST.object({ function: 'abs', args: [ 'e' ] }, test_schema_map)
		);
	});

	it(`Should match output for property argument type`, () => {
		expect(abs([ pn ])).toStrictEqual(
			GenerateNotionFormulaAST.object({ function: 'abs', args: [ { property: 'number' } ] }, test_schema_map)
		);
	});

	it(`Should match output for function argument type`, () => {
		expect(abs([ abs([ cn ]) ])).toStrictEqual(
			GenerateNotionFormulaAST.object({ function: 'abs', args: [ { function: 'abs', args: [ 1 ] } ] }, test_schema_map)
		);
	});
});
