import { TFormulaResultType, TFunctionName } from '@nishans/types';
import { ISchemaMap } from '../../src';

interface IFunctionFormulaInfo {
	return_type: TFormulaResultType;
	args: TFormulaResultType[][];
	function_name: TFunctionName;
}

function generateNrt1NAF (function_name: TFunctionName): IFunctionFormulaInfo {
	return {
		function_name,
		return_type: 'number',
		args: [ [ 'number' ] ]
	};
}

function generateNrt1NAFs (function_names: TFunctionName[]) {
	return function_names.map(generateNrt1NAF);
}

export const function_formula_info: IFunctionFormulaInfo[] = [
	...generateNrt1NAFs([
		'abs',
		'cbrt',
		'unaryMinus',
		'unaryPlus',
		'ceil',
		'exp',
		'floor',
		'ln',
		'log10',
		'log2',
		'max',
		'min',
		'round',
		'sign',
		'sqrt'
	]),
	{
		function_name: 'equal',
		return_type: 'checkbox',
		args: [ [ 'text', 'text' ], [ 'date', 'date' ], [ 'checkbox', 'checkbox' ], [ 'number', 'number' ] ]
	}
];

export const test_schema_map: ISchemaMap = new Map([
	[ 'number', { schema_id: 'number', type: 'number', name: 'number' } ],
	[ 'text', { schema_id: 'text', type: 'text', name: 'text' } ],
	[ 'checkbox', { schema_id: 'checkbox', type: 'checkbox', name: 'checkbox' } ],
	[ 'date', { schema_id: 'date', type: 'date', name: 'date' } ]
]);
