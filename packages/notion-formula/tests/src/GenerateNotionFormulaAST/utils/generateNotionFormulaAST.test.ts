import { generateNotionFormulaAST } from '../../../../src/GenerateNotionFormulaAST/utils';
import { test_schema_map } from '../../utils';

it(`Should work for string representation`, () => {
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
	}).toStrictEqual(generateNotionFormulaAST('abs(1)', 'string', test_schema_map));
});

it(`Should work for array representation`, () => {
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
	}).toStrictEqual(generateNotionFormulaAST([ 'abs', [ 1 ] ], 'array', test_schema_map));
});

it(`Should work for array representation`, () => {
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
	}).toStrictEqual(generateNotionFormulaAST({ function: 'abs', args: [ 1 ] }, 'object', test_schema_map));
});
