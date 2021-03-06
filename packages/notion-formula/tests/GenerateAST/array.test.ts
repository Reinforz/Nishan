import { NotionFormula } from '../../libs';
import { abs, cn, pn, sn, test_schema_map } from '../utils';

describe('Function formula array representation parsing success', () => {
	it(`Should match output for constant argument type`, () => {
		expect(abs([ cn ])).toStrictEqual(NotionFormula.GenerateAST.array([ 'abs', [ 1 ] ], test_schema_map));
	});

	it(`Should match output for symbol argument type`, () => {
		expect(abs([ sn ])).toStrictEqual(NotionFormula.GenerateAST.array([ 'abs', [ 'e' ] ], test_schema_map));
	});

	it(`Should match output for property argument type`, () => {
		expect(abs([ pn ])).toStrictEqual(
			NotionFormula.GenerateAST.array([ 'abs', [ { property: 'number' } ] ], test_schema_map)
		);
	});

	it(`Should match output for function argument type`, () => {
		expect(abs([ abs([ cn ]) ])).toStrictEqual(
			NotionFormula.GenerateAST.array([ 'abs', [ [ 'abs', [ 1 ] ] ] ], test_schema_map)
		);
	});
});

describe('Function formula parsing error', () => {
	it('Should throw for improper zero arity function', () => {
		expect(() => NotionFormula.GenerateAST.array([ 'now', [ '1', 'e' ] ] as any)).toThrow(
			`Function now takes 0 arguments, given 2`
		);
	});

	it('Should throw for improper variadic argument type', () => {
		expect(() => NotionFormula.GenerateAST.array([ 'max', [ '1', 'e' ] as any ])).toThrow(
			`Argument of type text can't be used as argument 1 for function max`
		);
	});

	it(`Should throw for using unknown function`, () => {
		expect(() => NotionFormula.GenerateAST.array([ 'unknown' ] as any, test_schema_map)).toThrow();
	});

	it('Should throw for more function arguments', () => {
		expect(() => NotionFormula.GenerateAST.array([ 'abs', [ 1, 2 ] as any ])).toThrow(
			`Function abs takes 1 arguments, given 2`
		);
	});

	it('Should throw for fewer function arguments', () => {
		expect(() => NotionFormula.GenerateAST.array([ 'abs' ] as any)).toThrow(`Function abs takes 1 arguments, given 0`);
	});

	it('Should throw for improper function argument (constant) type', () => {
		expect(() => NotionFormula.GenerateAST.array([ 'abs', [ '1' ] as any ])).toThrow(
			`Argument of type text can't be used as argument 1 for function abs`
		);
	});

	it('Should throw for improper function argument (function) type', () => {
		expect(() => NotionFormula.GenerateAST.array([ 'abs', [ [ 'concat', '1', '1' ] ] as any ])).toThrow(
			`Argument of type text can't be used as argument 1 for function abs`
		);
	});

	it('Should throw for improper function argument (property) type', () => {
		expect(() => NotionFormula.GenerateAST.array([ 'abs', [ { property: 'text' } ] as any ], test_schema_map)).toThrow(
			`Argument of type text can't be used as argument 1 for function abs`
		);
	});

	it('Should throw for improper property argument type', () => {
		expect(() => NotionFormula.GenerateAST.array([ 'abs', [ { property: 'text' } ] as any ])).toThrow(
			`A property is referenced in the formula, but schema_map argument was not passed`
		);
	});
});
