import deepEqual from 'deep-equal';
import { generateFormulaArgFromProperty, generateFormulaArgsFromLiterals } from '../src';
import { test_schema_map } from './utils';

describe('Checking symbol type formula part', () => {
	it('Should output correctly for symbol true', () => {
		expect(
			deepEqual(
				{
					type: 'symbol',
					name: 'true',
					result_type: 'checkbox'
				},
				generateFormulaArgsFromLiterals(true),
				{
					strict: true
				}
			)
		).toBe(true);
	});

	it('Should output correctly for symbol false', () => {
		expect(
			deepEqual(
				{
					type: 'symbol',
					name: 'false',
					result_type: 'checkbox'
				},
				generateFormulaArgsFromLiterals(false),
				{
					strict: true
				}
			)
		).toBe(true);
	});

	it('Should output correctly for symbol e', () => {
		expect(
			deepEqual(
				{
					type: 'symbol',
					name: 'e',
					result_type: 'number'
				},
				generateFormulaArgsFromLiterals('e'),
				{
					strict: true
				}
			)
		).toBe(true);
	});

	it('Should output correctly for symbol pi', () => {
		expect(
			deepEqual(
				{
					type: 'symbol',
					name: 'pi',
					result_type: 'number'
				},
				generateFormulaArgsFromLiterals('pi'),
				{
					strict: true
				}
			)
		).toBe(true);
	});
});

describe('Checking constant type formula part', () => {
	it('Should output correctly for constant "1"', () => {
		expect(
			deepEqual(
				{
					type: 'constant',
					value: '1',
					value_type: 'string',
					result_type: 'text'
				},
				generateFormulaArgsFromLiterals('1'),
				{
					strict: true
				}
			)
		).toBe(true);
	});

	it('Should output correctly for constant 1', () => {
		expect(
			deepEqual(
				{
					type: 'constant',
					value: '1',
					value_type: 'number',
					result_type: 'number'
				},
				generateFormulaArgsFromLiterals(1),
				{
					strict: true
				}
			)
		).toBe(true);
	});
});

it('Should throw error when unsupported literal is used', () => {
	expect(() => generateFormulaArgsFromLiterals({} as any)).toThrow(`${{}} is a malformed value`);
});

describe('Checking property type formula part', () => {
	it('Should output correctly for correct text property reference', () => {
		expect(
			deepEqual(
				{
					type: 'property',
					id: 'text',
					name: 'text',
					result_type: 'text'
				},
				generateFormulaArgFromProperty({ property: 'text' }, test_schema_map),
				{
					strict: true
				}
			)
		).toBe(true);
	});

	it('Should output correctly for correct formula property reference', () => {
		expect(
			deepEqual(
				{
					type: 'property',
					id: 'formula',
					name: 'formula',
					result_type: 'number'
				},
				generateFormulaArgFromProperty({ property: 'formula' }, test_schema_map),
				{
					strict: true
				}
			)
		).toBe(true);
	});

	it('Should output correctly for correct rollup property reference', () => {
		expect(
			deepEqual(
				{
					type: 'property',
					id: 'rollup',
					name: 'Rollup',
					result_type: 'number'
				},
				generateFormulaArgFromProperty({ property: 'Rollup' }, test_schema_map),
				{
					strict: true
				}
			)
		).toBe(true);
	});
});

describe('Check when the property name doesnot exist', () => {
	it(`Should throw when unknown property is referenced`, () => {
		expect(() => generateFormulaArgFromProperty({ property: 'unknown' }, test_schema_map)).toThrow(
			`Property unknown does not exist on the given schema_map`
		);
	});
});
