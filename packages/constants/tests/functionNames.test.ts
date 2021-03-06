import { TFunctionName } from '@nishans/types';
import { NotionConstants } from '../libs';

it('NotionConstants.functionNames', () => {
	const function_names = NotionConstants.functionNames();
	const function_names_map: Map<TFunctionName, true> = new Map();
	function_names.forEach((function_name) => function_names_map.set(function_name, true));

	const expected_function_names: TFunctionName[] = [
		'unaryMinus',
		'unaryPlus',
		'add',
		'subtract',
		'multiply',
		'divide',
		'pow',
		'mod',
		'and',
		'or',
		'larger',
		'largerEq',
		'smaller',
		'smallerEq',
		'not',
		'length',
		'format',
		'equal',
		'unequal',
		'if',
		'concat',
		'join',
		'slice',
		'toNumber',
		'contains',
		'replace',
		'replaceAll',
		'test',
		'empty',
		'abs',
		'cbrt',
		'ceil',
		'exp',
		'floor',
		'ln',
		'log10',
		'log2',
		'min',
		'max',
		'round',
		'sign',
		'sqrt',
		'start',
		'end',
		'now',
		'timestamp',
		'fromTimestamp',
		'dateAdd',
		'dateSubtract',
		'dateBetween',
		'formatDate',
		'minute',
		'hour',
		'day',
		'date',
		'month',
		'year'
	];

	expect(function_names.length === expected_function_names.length).toBe(true);
	expected_function_names.forEach((expected_function_name) =>
		expect(function_names_map.get(expected_function_name)).toBe(true)
	);
});
