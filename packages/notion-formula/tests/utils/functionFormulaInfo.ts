import { TFormulaResultType, TFunctionName } from '@nishans/types';
import { ISchemaMap } from '../../src';

interface IFunctionFormulaInfo {
	return_type: TFormulaResultType;
	args: TFormulaResultType[][];
	function_name: TFunctionName;
}

// Generate number return type 2 number arguments formula
function generateNrt2NAF (function_name: TFunctionName): IFunctionFormulaInfo {
	return {
		function_name,
		return_type: 'number',
		args: [ [ 'number', 'number' ] ]
	};
}

// Generate number return type 2 number arguments formulas
function generateNrt2NAFs (function_names: TFunctionName[]) {
	return function_names.map(generateNrt2NAF);
}

// Generate number return type 1 number argument formula
function generateNrt1NAF (function_name: TFunctionName): IFunctionFormulaInfo {
	return {
		function_name,
		return_type: 'number',
		args: [ [ 'number' ] ]
	};
}

// Generate number return type 1 number argument formulas
function generateNrt1NAFs (function_names: TFunctionName[]) {
	return function_names.map(generateNrt1NAF);
}

// Generate checkbox return type 2 checkbox arguments formula
function generateCrt2CAF (function_name: TFunctionName): IFunctionFormulaInfo {
	return {
		function_name,
		return_type: 'checkbox',
		args: [ [ 'checkbox', 'checkbox' ] ]
	};
}

// Generate checkbox return type 2 checkbox arguments formulas
function generateCrt2CAFs (function_names: TFunctionName[]) {
	return function_names.map(generateCrt2CAF);
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
	},
	{
		function_name: 'unequal',
		return_type: 'checkbox',
		args: [ [ 'text', 'text' ], [ 'date', 'date' ], [ 'checkbox', 'checkbox' ], [ 'number', 'number' ] ]
	},
	...generateCrt2CAFs([ 'and', 'or', 'larger', 'largerEq', 'smaller', 'smallerEq' ]),
	{
		function_name: 'not',
		return_type: 'checkbox',
		args: [ [ 'checkbox' ] ]
	},
	...generateNrt2NAFs([ 'subtract', 'multiply', 'divide', 'pow', 'mod' ]),
	{
		function_name: 'concat',
		return_type: 'text',
		args: [ [ 'text', 'text' ] ]
	},
	{
		function_name: 'join',
		return_type: 'text',
		args: [ [ 'text', 'text', 'text' ] ]
	},
	{
		function_name: 'slice',
		return_type: 'text',
		args: [ [ 'text', 'number', 'number' ], [ 'text', 'number' ] ]
	},
	{
		function_name: 'length',
		return_type: 'number',
		args: [ [ 'text' ] ]
	},
	{
		function_name: 'format',
		return_type: 'text',
		args: [ [ 'text' ], [ 'date' ], [ 'number' ], [ 'checkbox' ] ]
	},
	{
		function_name: 'toNumber',
		return_type: 'number',
		args: [ [ 'text' ], [ 'date' ], [ 'number' ], [ 'checkbox' ] ]
	},
	{
		function_name: 'contains',
		return_type: 'checkbox',
		args: [ [ 'text', 'text' ] ]
	},
	{
		function_name: 'replace',
		return_type: 'text',
		args: [ [ 'text', 'text', 'text' ], [ 'number', 'text', 'text' ], [ 'checkbox', 'text', 'text' ] ]
	},
	{
		function_name: 'replaceAll',
		return_type: 'text',
		args: [ [ 'text', 'text', 'text' ], [ 'number', 'text', 'text' ], [ 'checkbox', 'text', 'text' ] ]
	},
	{
		function_name: 'test',
		return_type: 'checkbox',
		args: [ [ 'text', 'text' ], [ 'number', 'text' ], [ 'checkbox', 'text' ] ]
	},
	{
		function_name: 'empty',
		return_type: 'checkbox',
		args: [ [ 'text' ], [ 'date' ], [ 'number' ], [ 'checkbox' ] ]
	},
	{
		function_name: 'start',
		return_type: 'date',
		args: [ [ 'date' ] ]
	},
	{
		function_name: 'end',
		return_type: 'date',
		args: [ [ 'date' ] ]
	},
	{
		function_name: 'now',
		return_type: 'date',
		args: []
	},
	{
		function_name: 'timestamp',
		return_type: 'number',
		args: [ [ 'date' ] ]
	},
	{
		function_name: 'fromTimestamp',
		return_type: 'date',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'minute',
		return_type: 'number',
		args: [ [ 'date' ] ]
	},
	{
		function_name: 'hour',
		return_type: 'number',
		args: [ [ 'date' ] ]
	},
	{
		function_name: 'date',
		return_type: 'number',
		args: [ [ 'date' ] ]
	},
	{
		function_name: 'date',
		return_type: 'number',
		args: [ [ 'date' ] ]
	},
	{
		function_name: 'month',
		return_type: 'number',
		args: [ [ 'date' ] ]
	},
	{
		function_name: 'year',
		return_type: 'number',
		args: [ [ 'date' ] ]
	}
];

export const test_schema_map: ISchemaMap = new Map([
	[ 'number', { schema_id: 'number', type: 'number', name: 'number' } ],
	[ 'text', { schema_id: 'text', type: 'text', name: 'text' } ],
	[ 'checkbox', { schema_id: 'checkbox', type: 'checkbox', name: 'checkbox' } ],
	[ 'date', { schema_id: 'date', type: 'date', name: 'date' } ]
]);
