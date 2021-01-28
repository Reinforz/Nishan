import { TFormulaResultType, TFunctionName } from '@nishans/types';
import { ISchemaMap } from '../../src';

export const function_formula_info: {
	return_type: TFormulaResultType;
	args: TFormulaResultType[][];
	function_name: TFunctionName;
}[] = [
	{
		function_name: 'abs',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'cbrt',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'unaryMinus',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'unaryPlus',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'abs',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'cbrt',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'ceil',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'exp',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'floor',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'ln',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'log10',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'log2',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'max',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'min',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'round',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'sign',
		return_type: 'number',
		args: [ [ 'number' ] ]
	},
	{
		function_name: 'sqrt',
		return_type: 'number',
		args: [ [ 'number' ] ]
	}
];

export const test_schema_map: ISchemaMap = new Map([
	[ 'number', { schema_id: 'number', type: 'number', name: 'number' } ],
	[ 'text', { schema_id: 'text', type: 'text', name: 'text' } ],
	[ 'checkbox', { schema_id: 'checkbox', type: 'checkbox', name: 'checkbox' } ],
	[ 'date', { schema_id: 'date', type: 'date', name: 'date' } ]
]);
