import { GenerateNotionFormulaArg } from '../../../src';
import { test_schema_map } from '../utils';

it('Should output correctly for correct text property reference', () => {
	expect({
		type: 'property',
		id: 'text',
		name: 'text',
		result_type: 'text'
	}).toStrictEqual(GenerateNotionFormulaArg.property({ property: 'text' }, test_schema_map));
});

it('Should output correctly for correct formula property reference', () => {
	expect({
		type: 'property',
		id: 'formula',
		name: 'formula',
		result_type: 'number'
	}).toStrictEqual(GenerateNotionFormulaArg.property({ property: 'formula' }, test_schema_map));
});

it('Should output correctly for correct rollup property reference', () => {
	expect({
		type: 'property',
		id: 'rollup',
		name: 'Rollup',
		result_type: 'number'
	}).toStrictEqual(GenerateNotionFormulaArg.property({ property: 'Rollup' }, test_schema_map));
});

it(`Should throw when unknown property is referenced`, () => {
	expect(() => GenerateNotionFormulaArg.property({ property: 'unknown' }, test_schema_map)).toThrow(
		`Property unknown does not exist on the given schema_map`
	);
});
