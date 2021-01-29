import { TFormulaResultType, TFunctionName } from '@nishans/types';

type IFunctionForumlaSignature =
	| {
			arity: TFormulaResultType[];
			result_type: TFormulaResultType;
		}
	| {
			variadic: TFormulaResultType;
			result_type: TFormulaResultType;
		};
interface IFunctionFormulaInfo {
	signatures: IFunctionForumlaSignature[];
	function_name: TFunctionName;
}

function generateFormulaInfo (
	function_name: TFunctionName,
	signatures: [TFormulaResultType, TFormulaResultType[]][]
): IFunctionFormulaInfo {
	return {
		function_name,
		signatures: signatures.map(([ result_type, arity ]) => ({ arity, result_type }))
	};
}

/**
 * An array that contains the result_type and the variations of arguments (number and types) supported by all the notion formulas
 */
export const function_formula_info_arr: IFunctionFormulaInfo[] = [
	generateFormulaInfo('if', [
		[ 'number', [ 'checkbox', 'number', 'number' ] ],
		[ 'text', [ 'checkbox', 'text', 'text' ] ],
		[ 'checkbox', [ 'checkbox', 'checkbox', 'checkbox' ] ],
		[ 'date', [ 'checkbox', 'date', 'date' ] ]
	]),
	generateFormulaInfo('add', [ [ 'text', [ 'text', 'text' ] ], [ 'number', [ 'number', 'number' ] ] ]),
	generateFormulaInfo('abs', [ [ 'number', [ 'number' ] ] ]),
	generateFormulaInfo('cbrt', [ [ 'number', [ 'number' ] ] ]),
	generateFormulaInfo('unaryMinus', [ [ 'number', [ 'number' ] ] ]),
	generateFormulaInfo('unaryPlus', [
		[ 'number', [ 'checkbox' ] ],
		[ 'number', [ 'text' ] ],
		[ 'number', [ 'number' ] ]
	]),
	generateFormulaInfo('ceil', [ [ 'number', [ 'number' ] ] ]),
	generateFormulaInfo('exp', [ [ 'number', [ 'number' ] ] ]),
	generateFormulaInfo('floor', [ [ 'number', [ 'number' ] ] ]),
	generateFormulaInfo('ln', [ [ 'number', [ 'number' ] ] ]),
	generateFormulaInfo('log10', [ [ 'number', [ 'number' ] ] ]),
	generateFormulaInfo('log2', [ [ 'number', [ 'number' ] ] ]),
	{
		function_name: 'max',
		signatures: [
			{
				result_type: 'number',
				variadic: 'number'
			}
		]
	},
	{
		function_name: 'min',
		signatures: [
			{
				result_type: 'number',
				variadic: 'number'
			}
		]
	},
	generateFormulaInfo('round', [ [ 'number', [ 'number' ] ] ]),
	generateFormulaInfo('sign', [ [ 'number', [ 'number' ] ] ]),
	generateFormulaInfo('sqrt', [ [ 'number', [ 'number' ] ] ]),
	generateFormulaInfo('equal', [
		[ 'checkbox', [ 'number', 'number' ] ],
		[ 'checkbox', [ 'text', 'text' ] ],
		[ 'checkbox', [ 'checkbox', 'checkbox' ] ],
		[ 'checkbox', [ 'date', 'date' ] ]
	]),
	generateFormulaInfo('unequal', [
		[ 'checkbox', [ 'number', 'number' ] ],
		[ 'checkbox', [ 'text', 'text' ] ],
		[ 'checkbox', [ 'checkbox', 'checkbox' ] ],
		[ 'checkbox', [ 'date', 'date' ] ]
	]),
	generateFormulaInfo('and', [ [ 'checkbox', [ 'checkbox', 'checkbox' ] ] ]),
	generateFormulaInfo('or', [ [ 'checkbox', [ 'checkbox', 'checkbox' ] ] ]),
	generateFormulaInfo('larger', [
		[ 'checkbox', [ 'number', 'number' ] ],
		[ 'checkbox', [ 'text', 'text' ] ],
		[ 'checkbox', [ 'checkbox', 'checkbox' ] ],
		[ 'checkbox', [ 'date', 'date' ] ]
	]),
	generateFormulaInfo('largerEq', [
		[ 'checkbox', [ 'number', 'number' ] ],
		[ 'checkbox', [ 'text', 'text' ] ],
		[ 'checkbox', [ 'checkbox', 'checkbox' ] ],
		[ 'checkbox', [ 'date', 'date' ] ]
	]),
	generateFormulaInfo('smaller', [
		[ 'checkbox', [ 'number', 'number' ] ],
		[ 'checkbox', [ 'text', 'text' ] ],
		[ 'checkbox', [ 'checkbox', 'checkbox' ] ],
		[ 'checkbox', [ 'date', 'date' ] ]
	]),
	generateFormulaInfo('smallerEq', [
		[ 'checkbox', [ 'number', 'number' ] ],
		[ 'checkbox', [ 'text', 'text' ] ],
		[ 'checkbox', [ 'checkbox', 'checkbox' ] ],
		[ 'checkbox', [ 'date', 'date' ] ]
	]),
	generateFormulaInfo('not', [ [ 'checkbox', [ 'checkbox' ] ] ]),
	generateFormulaInfo('subtract', [ [ 'number', [ 'number', 'number' ] ] ]),
	generateFormulaInfo('multiply', [ [ 'number', [ 'number', 'number' ] ] ]),
	generateFormulaInfo('divide', [ [ 'number', [ 'number', 'number' ] ] ]),
	generateFormulaInfo('pow', [ [ 'number', [ 'number', 'number' ] ] ]),
	generateFormulaInfo('mod', [ [ 'number', [ 'number', 'number' ] ] ]),
	{
		function_name: 'concat',
		signatures: [
			{
				result_type: 'text',
				variadic: 'text'
			}
		]
	},
	{
		function_name: 'join',
		signatures: [
			{
				result_type: 'text',
				variadic: 'text'
			}
		]
	},
	generateFormulaInfo('slice', [ [ 'text', [ 'text', 'number' ] ], [ 'text', [ 'text', 'number', 'number' ] ] ]),
	generateFormulaInfo('length', [ [ 'number', [ 'text' ] ] ]),
	generateFormulaInfo('format', [
		[ 'text', [ 'text' ] ],
		[ 'text', [ 'date' ] ],
		[ 'text', [ 'number' ] ],
		[ 'text', [ 'checkbox' ] ]
	]),
	generateFormulaInfo('toNumber', [
		[ 'number', [ 'text' ] ],
		[ 'number', [ 'date' ] ],
		[ 'number', [ 'number' ] ],
		[ 'number', [ 'checkbox' ] ]
	]),
	generateFormulaInfo('contains', [ [ 'checkbox', [ 'text', 'text' ] ] ]),
	generateFormulaInfo('replace', [
		[ 'text', [ 'text', 'text', 'text' ] ],
		[ 'text', [ 'number', 'text', 'text' ] ],
		[ 'text', [ 'checkbox', 'text', 'text' ] ]
	]),
	generateFormulaInfo('replaceAll', [
		[ 'text', [ 'text', 'text', 'text' ] ],
		[ 'text', [ 'number', 'text', 'text' ] ],
		[ 'text', [ 'checkbox', 'text', 'text' ] ]
	]),
	generateFormulaInfo('test', [
		[ 'checkbox', [ 'text', 'text' ] ],
		[ 'checkbox', [ 'number', 'text' ] ],
		[ 'checkbox', [ 'checkbox', 'text' ] ]
	]),
	generateFormulaInfo('empty', [
		[ 'checkbox', [ 'text' ] ],
		[ 'checkbox', [ 'number' ] ],
		[ 'checkbox', [ 'checkbox' ] ],
		[ 'checkbox', [ 'date' ] ]
	]),
	generateFormulaInfo('start', [ [ 'date', [ 'date' ] ] ]),
	generateFormulaInfo('end', [ [ 'date', [ 'date' ] ] ]),
	generateFormulaInfo('now', [ [ 'date', [] ] ]),
	generateFormulaInfo('fromTimestamp', [ [ 'date', [ 'number' ] ] ]),
	generateFormulaInfo('dateAdd', [ [ 'date', [ 'date', 'number', 'text' ] ] ]),
	generateFormulaInfo('dateSubtract', [ [ 'date', [ 'date', 'number', 'text' ] ] ]),
	generateFormulaInfo('dateBetween', [ [ 'number', [ 'date', 'date', 'text' ] ] ]),
	generateFormulaInfo('formatDate', [ [ 'text', [ 'date', 'text' ] ] ]),
	generateFormulaInfo('timestamp', [ [ 'number', [ 'date' ] ] ]),
	generateFormulaInfo('minute', [ [ 'number', [ 'date' ] ] ]),
	generateFormulaInfo('hour', [ [ 'number', [ 'date' ] ] ]),
	generateFormulaInfo('date', [ [ 'number', [ 'date' ] ] ]),
	generateFormulaInfo('day', [ [ 'number', [ 'date' ] ] ]),
	generateFormulaInfo('month', [ [ 'number', [ 'date' ] ] ]),
	generateFormulaInfo('year', [ [ 'number', [ 'date' ] ] ])
];

export const function_formula_info_map: Map<TFunctionName, IFunctionFormulaInfo> = new Map(
	function_formula_info_arr.map((function_formula_info) => [
		function_formula_info.function_name,
		function_formula_info
	])
);
