import { generateFormulaArgFromProperty, generateFormulaArgsFromLiterals } from '../../src';
import { test_schema_map } from '.';

describe('Checking symbol type formula part', () => {
	it('Should output correctly for symbol true', () => {
		expect({
			type: 'symbol',
			name: 'true',
			result_type: 'checkbox'
		}).toStrictEqual(generateFormulaArgsFromLiterals(true));
	});

	it('Should output correctly for symbol false', () => {
		expect({
			type: 'symbol',
			name: 'false',
			result_type: 'checkbox'
		}).toStrictEqual(generateFormulaArgsFromLiterals(false));
	});

	it('Should output correctly for symbol e', () => {
		expect({
			type: 'symbol',
			name: 'e',
			result_type: 'number'
		}).toStrictEqual(generateFormulaArgsFromLiterals('e'));
	});

	it('Should output correctly for symbol pi', () => {
		expect({
			type: 'symbol',
			name: 'pi',
			result_type: 'number'
		}).toStrictEqual(generateFormulaArgsFromLiterals('pi'));
	});
});

describe('Checking constant type formula part', () => {
	it('Should output correctly for constant "1"', () => {
		expect({
			type: 'constant',
			value: '1',
			value_type: 'string',
			result_type: 'text'
		}).toStrictEqual(generateFormulaArgsFromLiterals('1'));
	});

	it('Should output correctly for constant 1', () => {
		expect({
			type: 'constant',
			value: '1',
			value_type: 'number',
			result_type: 'number'
		}).toStrictEqual(generateFormulaArgsFromLiterals(1));
	});
});

it('Should throw error when unsupported literal is used', () => {
	expect(() => generateFormulaArgsFromLiterals({} as any)).toThrow(`${{}} is a malformed value`);
});

describe('Checking property type formula part', () => {
	it('Should output correctly for correct text property reference', () => {
		expect({
			type: 'property',
			id: 'text',
			name: 'text',
			result_type: 'text'
		}).toStrictEqual(generateFormulaArgFromProperty({ property: 'text' }, test_schema_map));
	});

	it('Should output correctly for correct formula property reference', () => {
		expect({
			type: 'property',
			id: 'formula',
			name: 'formula',
			result_type: 'number'
		}).toStrictEqual(generateFormulaArgFromProperty({ property: 'formula' }, test_schema_map));
	});

	it('Should output correctly for correct rollup property reference', () => {
		expect({
			type: 'property',
			id: 'rollup',
			name: 'Rollup',
			result_type: 'number'
		}).toStrictEqual(generateFormulaArgFromProperty({ property: 'Rollup' }, test_schema_map));
	});
});

describe('Check when the property name doesnot exist', () => {
	it(`Should throw when unknown property is referenced`, () => {
		expect(() => generateFormulaArgFromProperty({ property: 'unknown' }, test_schema_map)).toThrow(
			`Property unknown does not exist on the given schema_map`
		);
	});
});
