import { NotionFormula } from '../../libs';
import { abs, cn, ct, pn, sc, sn, test_schema_map } from '../utils';

describe('Zero arity function parsing', () => {
	it(`Should parse correctly when passed correct types`, () => {
		expect({
			name: 'now',
			type: 'function',
			result_type: 'date'
		}).toStrictEqual(NotionFormula.GenerateAST.object({ function: 'now' }, test_schema_map));
	});
});

describe('Variadic argument array representation parsing', () => {
	it(`Should parse correctly when passed correct types`, () => {
		expect({
			name: 'max',
			type: 'function',
			args: [ cn, sn ],
			result_type: 'number'
		}).toStrictEqual(NotionFormula.GenerateAST.object({ function: 'max', args: [ 1, 'e' ] }, test_schema_map));
	});
});

describe('Function formula parsing success for literal arguments', () => {
	it('Should match output for number x symbol argument variant', () => {
		expect(sn).toStrictEqual(NotionFormula.GenerateAST.object('e'));
	});

	it('Should match output for checkbox x symbol argument variant', () => {
		expect(sc).toStrictEqual(NotionFormula.GenerateAST.object(true));
	});

	it('Should match output for string x constant argument variant', () => {
		expect(ct).toStrictEqual(NotionFormula.GenerateAST.object('text'));
	});

	it('Should match output for number x constant argument variant', () => {
		expect(cn).toStrictEqual(NotionFormula.GenerateAST.object(1));
	});

	it('Should match output for number x property argument variant', () => {
		expect(pn).toStrictEqual(NotionFormula.GenerateAST.object({ property: 'number' }, test_schema_map));
	});
});

describe('Function formula object representation parsing success for function argument', () => {
	it(`Should match output for constant argument type`, () => {
		expect(abs([ cn ])).toStrictEqual(
			NotionFormula.GenerateAST.object({ function: 'abs', args: [ 1 ] }, test_schema_map)
		);
	});

	it(`Should match output for symbol argument type`, () => {
		expect(abs([ sn ])).toStrictEqual(
			NotionFormula.GenerateAST.object({ function: 'abs', args: [ 'e' ] }, test_schema_map)
		);
	});

	it(`Should match output for property argument type`, () => {
		expect(abs([ pn ])).toStrictEqual(
			NotionFormula.GenerateAST.object({ function: 'abs', args: [ { property: 'number' } ] }, test_schema_map)
		);
	});

	it(`Should match output for function argument type`, () => {
		expect(abs([ abs([ cn ]) ])).toStrictEqual(
			NotionFormula.GenerateAST.object({ function: 'abs', args: [ { function: 'abs', args: [ 1 ] } ] }, test_schema_map)
		);
	});
});
