import { generateNotionFormulaAST } from '../../../../src/GenerateNotionFormulaAST/utils';
import { abs, cn, test_schema_map } from '../../utils';

it(`Should work for string representation`, () => {
	expect(abs([ cn ])).toStrictEqual(generateNotionFormulaAST('abs(1)', 'string', test_schema_map));
});

it(`Should work for array representation`, () => {
	expect(abs([ cn ])).toStrictEqual(generateNotionFormulaAST([ 'abs', [ 1 ] ], 'array', test_schema_map));
});

it(`Should work for object representation`, () => {
	expect(abs([ cn ])).toStrictEqual(
		generateNotionFormulaAST({ function: 'abs', args: [ 1 ] }, 'object', test_schema_map)
	);
});
