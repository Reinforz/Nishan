import { NotionFormula } from '../../libs';
import { pt, test_schema_map } from '../utils';

it('Should output correctly for correct text property reference', () => {
	expect(pt).toStrictEqual(NotionFormula.GenerateArg.property({ property: 'text' }, test_schema_map));
});

it('Should output correctly for correct formula property reference', () => {
	expect({
		type: 'property',
		id: 'formula',
		name: 'formula',
		result_type: 'number'
	}).toStrictEqual(NotionFormula.GenerateArg.property({ property: 'formula' }, test_schema_map));
});

it('Should output correctly for correct rollup property reference', () => {
	expect({
		type: 'property',
		id: 'rollup',
		name: 'Rollup',
		result_type: 'number'
	}).toStrictEqual(NotionFormula.GenerateArg.property({ property: 'Rollup' }, test_schema_map));
});

it(`Should throw when unknown property is referenced`, () => {
	expect(() => NotionFormula.GenerateArg.property({ property: 'unknown' }, test_schema_map)).toThrow();
});
