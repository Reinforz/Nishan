import { GenerateNotionFormulaAST } from '../../../src';
import { test_schema_map } from '../utils';

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
		}).toStrictEqual(GenerateNotionFormulaAST.object({ function: 'max', args: [ 1, 'e' ] }, test_schema_map));
	});
});

describe('Function formula parsing success for literal arguments', () => {
	it('Should match output for number x symbol argument variant', () => {
		expect({
			type: 'symbol',
			name: 'e',
			result_type: 'number'
		}).toStrictEqual(GenerateNotionFormulaAST.object('e'));
	});

	it('Should match output for checkbox x symbol argument variant', () => {
		expect({
			type: 'symbol',
			name: 'true',
			result_type: 'checkbox'
		}).toStrictEqual(GenerateNotionFormulaAST.object(true));
	});

	it('Should match output for string x constant argument variant', () => {
		expect({
			type: 'constant',
			value: 'text',
			result_type: 'text',
			value_type: 'string'
		}).toStrictEqual(GenerateNotionFormulaAST.object('text'));
	});

	it('Should match output for number x constant argument variant', () => {
		expect({
			type: 'constant',
			value: '1',
			result_type: 'number',
			value_type: 'number'
		}).toStrictEqual(GenerateNotionFormulaAST.object(1));
	});

	it('Should match output for number x property argument variant', () => {
		expect({
			type: 'property',
			name: 'number',
			id: 'number',
			result_type: 'number'
		}).toStrictEqual(GenerateNotionFormulaAST.object({ property: 'number' }, test_schema_map));
	});
});

describe('Function formula object representation parsing success for function argument', () => {
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
		}).toStrictEqual(GenerateNotionFormulaAST.object({ function: 'abs', args: [ 1 ] }, test_schema_map));
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
		}).toStrictEqual(GenerateNotionFormulaAST.object({ function: 'abs', args: [ 'e' ] }, test_schema_map));
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
		}).toStrictEqual(
			GenerateNotionFormulaAST.object({ function: 'abs', args: [ { property: 'number' } ] }, test_schema_map)
		);
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
		}).toStrictEqual(
			GenerateNotionFormulaAST.object({ function: 'abs', args: [ { function: 'ceil', args: [ 1 ] } ] }, test_schema_map)
		);
	});
});
