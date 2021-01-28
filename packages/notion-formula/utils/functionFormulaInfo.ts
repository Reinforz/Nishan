import { TFormulaResultType, TFunctionName } from '@nishans/types';

interface IFunctionFormulaInfo {
	return_type: TFormulaResultType;
	args: TFormulaResultType[][];
	function_name: TFunctionName;
}

// Generate number return type 2 number arguments formula
function generateNrt2Naf (function_name: TFunctionName): IFunctionFormulaInfo {
	return {
		function_name,
		return_type: 'number',
		args: [ [ 'number', 'number' ] ]
	};
}

// Generate number return type 2 number arguments formulas
function generateNrt2Nafs (function_names: TFunctionName[]) {
	return function_names.map(generateNrt2Naf);
}

// Generate number return type 1 number argument formula
function generateNrt1Naf (function_name: TFunctionName): IFunctionFormulaInfo {
	return {
		function_name,
		return_type: 'number',
		args: [ [ 'number' ] ]
	};
}

// Generate number return type 1 number argument formulas
function generateNrt1Nafs (function_names: TFunctionName[]) {
	return function_names.map(generateNrt1Naf);
}

// Generate checkbox return type 2 checkbox arguments formula
function generateCrt2Caf (function_name: TFunctionName): IFunctionFormulaInfo {
	return {
		function_name,
		return_type: 'checkbox',
		args: [ [ 'checkbox', 'checkbox' ] ]
	};
}

// Generate checkbox return type 2 checkbox arguments formulas
function generateCrt2Cafs (function_names: TFunctionName[]) {
	return function_names.map(generateCrt2Caf);
}

// Generate checkbox return type 2 any arguments formula
function generateCrt2Aaf (function_name: TFunctionName): IFunctionFormulaInfo {
	return {
		function_name,
		return_type: 'checkbox',
		args: [ [ 'text', 'text' ], [ 'date', 'date' ], [ 'checkbox', 'checkbox' ], [ 'number', 'number' ] ]
	};
}

// Generate checkbox return type 2 checkbox arguments formulas
function generateCrt2Aafs (function_names: TFunctionName[]) {
	return function_names.map(generateCrt2Aaf);
}

// Generate number return type 2 date arguments formula
function generateNrt1Daf (function_name: TFunctionName): IFunctionFormulaInfo {
	return {
		function_name,
		return_type: 'number',
		args: [ [ 'date' ] ]
	};
}

// Generate number return type 2 date arguments formulas
function generateNrt1Dafs (function_names: TFunctionName[]) {
	return function_names.map(generateNrt1Daf);
}

export const function_formula_info_arr: IFunctionFormulaInfo[] = [
	...generateNrt1Nafs([
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
	...generateCrt2Aafs([ 'equal', 'unequal' ]),
	...generateCrt2Cafs([ 'and', 'or', 'larger', 'largerEq', 'smaller', 'smallerEq' ]),
	{
		function_name: 'not',
		return_type: 'checkbox',
		args: [ [ 'checkbox' ] ]
	},
	...generateNrt2Nafs([ 'subtract', 'multiply', 'divide', 'pow', 'mod' ]),
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
		args: [ [ 'text', 'number' ], [ 'text', 'number', 'number' ] ]
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
		function_name: 'fromTimestamp',
		return_type: 'date',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'dateAdd',
		return_type: 'date',
		args: [ [ 'date', 'number', 'text' ] ]
	},
	{
		function_name: 'dateSubtract',
		return_type: 'date',
		args: [ [ 'date', 'date', 'text' ] ]
	},
	{
		function_name: 'dateBetween',
		return_type: 'number',
		args: [ [ 'date', 'text' ] ]
	},
	{
		function_name: 'formatDate',
		return_type: 'date',
		args: [ [ 'date', 'text' ] ]
	},
	...generateNrt1Dafs([ 'timestamp', 'minute', 'hour', 'date', 'day', 'month', 'year' ])
];

export const function_formula_info_map: Map<TFunctionName, IFunctionFormulaInfo> = new Map(
	function_formula_info_arr.map((function_formula_info) => [
		function_formula_info.function_name,
		function_formula_info
	])
);
