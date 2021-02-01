import { TFormulaResultType, TFunctionName, TOperator } from '@nishans/types';

export type IFunctionForumlaSignature = {
	arity?: TFormulaResultType[];
	result_type: TFormulaResultType;
	variadic?: TFormulaResultType;
};
export interface IFunctionFormulaInfo {
	signatures: IFunctionForumlaSignature[];
	function_name: TFunctionName;
	description: string;
	operator?: TOperator;
}

function generateFormulaInfo (
	description: string,
	function_name: TFunctionName,
	signatures: [TFormulaResultType, TFormulaResultType[]][],
	operator?: TOperator
): IFunctionFormulaInfo {
	return {
		description,
		operator,
		function_name,
		signatures: signatures.map(([ result_type, arity ]) => ({ arity, result_type }))
	};
}

/**
 * An array that contains the result_type and the variations of arguments (number and types) supported by all the notion formulas
 */
export const function_formula_info_arr: IFunctionFormulaInfo[] = [
	generateFormulaInfo('Switches between two options based on another value.', 'if', [
		[ 'number', [ 'checkbox', 'number', 'number' ] ],
		[ 'text', [ 'checkbox', 'text', 'text' ] ],
		[ 'checkbox', [ 'checkbox', 'checkbox', 'checkbox' ] ],
		[ 'date', [ 'checkbox', 'date', 'date' ] ]
	]),
	generateFormulaInfo(
		'Adds two numbers and returns their sum, or concatenates two strings.',
		'add',
		[ [ 'text', [ 'text', 'text' ] ], [ 'number', [ 'number', 'number' ] ] ],
		'+'
	),
	generateFormulaInfo('Returns the absolute value of a number', 'abs', [ [ 'number', [ 'number' ] ] ]),
	generateFormulaInfo('Returns the cube root of a number.', 'cbrt', [ [ 'number', [ 'number' ] ] ]),
	generateFormulaInfo('Negates a number.', 'unaryMinus', [ [ 'number', [ 'number' ] ] ]),
	generateFormulaInfo('Converts its argument into a number.', 'unaryPlus', [
		[ 'number', [ 'checkbox' ] ],
		[ 'number', [ 'text' ] ],
		[ 'number', [ 'number' ] ]
	]),
	generateFormulaInfo('Returns the smallest integer greater than or equal to a number.', 'ceil', [
		[ 'number', [ 'number' ] ]
	]),
	generateFormulaInfo(
		"Returns E^x, where x is the argument, and E is Euler's constant (2.718…), the base of the natural logarithm.",
		'exp',
		[ [ 'number', [ 'number' ] ] ]
	),
	generateFormulaInfo('Returns the largest integer less than or equal to a number.', 'floor', [
		[ 'number', [ 'number' ] ]
	]),
	generateFormulaInfo('Returns the natural logarithm of a number.', 'ln', [ [ 'number', [ 'number' ] ] ]),
	generateFormulaInfo('Returns the base 10 logarithm of a number.', 'log10', [ [ 'number', [ 'number' ] ] ]),
	generateFormulaInfo('Returns the base 2 logarithm of a number.', 'log2', [ [ 'number', [ 'number' ] ] ]),
	{
		description: 'Returns the largest of zero or more numbers.',
		function_name: 'max',
		signatures: [
			{
				result_type: 'number',
				variadic: 'number'
			}
		]
	},
	{
		description: 'Returns the smallest of zero or more numbers.',
		function_name: 'min',
		signatures: [
			{
				result_type: 'number',
				variadic: 'number'
			}
		]
	},
	generateFormulaInfo('Returns the value of a number rounded to the nearest integer.', 'round', [
		[ 'number', [ 'number' ] ]
	]),
	generateFormulaInfo('Returns the sign of the x, indicating whether x is positive, negative or zero.', 'sign', [
		[ 'number', [ 'number' ] ]
	]),
	generateFormulaInfo('Returns the positive square root of a number.', 'sqrt', [ [ 'number', [ 'number' ] ] ]),
	generateFormulaInfo(
		'Returns true if its arguments are equal, and false otherwise.',
		'equal',
		[
			[ 'checkbox', [ 'number', 'number' ] ],
			[ 'checkbox', [ 'text', 'text' ] ],
			[ 'checkbox', [ 'checkbox', 'checkbox' ] ],
			[ 'checkbox', [ 'date', 'date' ] ]
		],
		'=='
	),
	generateFormulaInfo(
		'Returns false if its arguments are equal, and true otherwise.',
		'unequal',
		[
			[ 'checkbox', [ 'number', 'number' ] ],
			[ 'checkbox', [ 'text', 'text' ] ],
			[ 'checkbox', [ 'checkbox', 'checkbox' ] ],
			[ 'checkbox', [ 'date', 'date' ] ]
		],
		'!='
	),
	generateFormulaInfo(
		'Returns the logical AND of its two arguments.',
		'and',
		[ [ 'checkbox', [ 'checkbox', 'checkbox' ] ] ],
		'and'
	),
	generateFormulaInfo(
		'Returns the logical OR of its two arguments.',
		'or',
		[ [ 'checkbox', [ 'checkbox', 'checkbox' ] ] ],
		'or'
	),
	generateFormulaInfo(
		'Returns true if the first argument is larger than the second.',
		'larger',
		[
			[ 'checkbox', [ 'number', 'number' ] ],
			[ 'checkbox', [ 'text', 'text' ] ],
			[ 'checkbox', [ 'checkbox', 'checkbox' ] ],
			[ 'checkbox', [ 'date', 'date' ] ]
		],
		'>'
	),
	generateFormulaInfo(
		'Returns true if the first argument is larger than or equal to than the second.',
		'largerEq',
		[
			[ 'checkbox', [ 'number', 'number' ] ],
			[ 'checkbox', [ 'text', 'text' ] ],
			[ 'checkbox', [ 'checkbox', 'checkbox' ] ],
			[ 'checkbox', [ 'date', 'date' ] ]
		],
		'>='
	),
	generateFormulaInfo(
		'Returns true if the first argument is smaller than the second.',
		'smaller',
		[
			[ 'checkbox', [ 'number', 'number' ] ],
			[ 'checkbox', [ 'text', 'text' ] ],
			[ 'checkbox', [ 'checkbox', 'checkbox' ] ],
			[ 'checkbox', [ 'date', 'date' ] ]
		],
		'<'
	),
	generateFormulaInfo(
		'Returns true if the first argument is smaller than or equal to than the second.',
		'smallerEq',
		[
			[ 'checkbox', [ 'number', 'number' ] ],
			[ 'checkbox', [ 'text', 'text' ] ],
			[ 'checkbox', [ 'checkbox', 'checkbox' ] ],
			[ 'checkbox', [ 'date', 'date' ] ]
		],
		'<='
	),
	generateFormulaInfo('Returns the logical NOT of its argument.', 'not', [ [ 'checkbox', [ 'checkbox' ] ] ], 'not'),
	generateFormulaInfo(
		'Subtracts two numbers and returns their difference.',
		'subtract',
		[ [ 'number', [ 'number', 'number' ] ] ],
		'-'
	),
	generateFormulaInfo(
		'Multiplies two numbers and returns their product.',
		'multiply',
		[ [ 'number', [ 'number', 'number' ] ] ],
		'*'
	),
	generateFormulaInfo(
		'Divides two numbers and returns their quotient.',
		'divide',
		[ [ 'number', [ 'number', 'number' ] ] ],
		'/'
	),
	generateFormulaInfo(
		'Returns base to the exponent power, that is, baseexponent.',
		'pow',
		[ [ 'number', [ 'number', 'number' ] ] ],
		'^'
	),
	generateFormulaInfo(
		'Divides two numbers and returns their remainder.',
		'mod',
		[ [ 'number', [ 'number', 'number' ] ] ],
		'%'
	),
	{
		description: 'Concatenates its arguments and returns the result.',
		function_name: 'concat',
		signatures: [
			{
				result_type: 'text',
				variadic: 'text'
			}
		]
	},
	{
		description: 'Inserts the first argument between the rest and returns their concatenation.',
		function_name: 'join',
		signatures: [
			{
				result_type: 'text',
				variadic: 'text'
			}
		]
	},
	generateFormulaInfo(
		'Extracts a substring from a string from the start index (inclusively) to the end index (optional and exclusively).',
		'slice',
		[ [ 'text', [ 'text', 'number' ] ], [ 'text', [ 'text', 'number', 'number' ] ] ]
	),
	generateFormulaInfo('Returns the length of a string.', 'length', [ [ 'number', [ 'text' ] ] ]),
	generateFormulaInfo('Formats its argument as a string.', 'format', [
		[ 'text', [ 'text' ] ],
		[ 'text', [ 'date' ] ],
		[ 'text', [ 'number' ] ],
		[ 'text', [ 'checkbox' ] ]
	]),
	generateFormulaInfo('Parses a number from text.', 'toNumber', [
		[ 'number', [ 'text' ] ],
		[ 'number', [ 'date' ] ],
		[ 'number', [ 'number' ] ],
		[ 'number', [ 'checkbox' ] ]
	]),
	generateFormulaInfo('Returns true if the second argument is found in the first.', 'contains', [
		[ 'checkbox', [ 'text', 'text' ] ]
	]),
	generateFormulaInfo('Replaces the first match of a regular expression with a new value.', 'replace', [
		[ 'text', [ 'text', 'text', 'text' ] ],
		[ 'text', [ 'number', 'text', 'text' ] ],
		[ 'text', [ 'checkbox', 'text', 'text' ] ]
	]),
	generateFormulaInfo('Replaces all matches of a regular expression with a new value.', 'replaceAll', [
		[ 'text', [ 'text', 'text', 'text' ] ],
		[ 'text', [ 'number', 'text', 'text' ] ],
		[ 'text', [ 'checkbox', 'text', 'text' ] ]
	]),
	generateFormulaInfo('Tests if a string matches a regular expression.', 'test', [
		[ 'checkbox', [ 'text', 'text' ] ],
		[ 'checkbox', [ 'number', 'text' ] ],
		[ 'checkbox', [ 'checkbox', 'text' ] ]
	]),
	generateFormulaInfo('Tests if a value is empty.', 'empty', [
		[ 'checkbox', [ 'text' ] ],
		[ 'checkbox', [ 'number' ] ],
		[ 'checkbox', [ 'checkbox' ] ],
		[ 'checkbox', [ 'date' ] ]
	]),
	generateFormulaInfo('Returns the start of a date range.', 'start', [ [ 'date', [ 'date' ] ] ]),
	generateFormulaInfo('Returns the end of a date range.', 'end', [ [ 'date', [ 'date' ] ] ]),
	generateFormulaInfo('Returns the current date and time.', 'now', [ [ 'date', [] ] ]),
	generateFormulaInfo(
		'Returns a date constructed from a Unix millisecond timestamp, corresponding to the number of milliseconds since January 1, 1970.',
		'fromTimestamp',
		[ [ 'date', [ 'number' ] ] ]
	),
	generateFormulaInfo(
		'Add to a date. The last argument, unit, can be one of: "years", "quarters", "months", "weeks", "days", "hours", "minutes", "seconds", or "milliseconds".',
		'dateAdd',
		[ [ 'date', [ 'date', 'number', 'text' ] ] ]
	),
	generateFormulaInfo(
		'Subtract from a date. The last argument, unit, can be one of: "years", "quarters", "months", "weeks", "days", "hours", "minutes", "seconds", or "milliseconds".',
		'dateSubtract',
		[ [ 'date', [ 'date', 'number', 'text' ] ] ]
	),
	generateFormulaInfo(
		'Returns the time between two dates. The last argument, unit, can be one of: "years", "quarters", "months", "weeks", "days", "hours", "minutes", "seconds", or "milliseconds".',
		'dateBetween',
		[ [ 'number', [ 'date', 'date', 'text' ] ] ]
	),
	generateFormulaInfo('Format a date using the Moment standard time format string.', 'formatDate', [
		[ 'text', [ 'date', 'text' ] ]
	]),
	generateFormulaInfo(
		'Returns an integer number from a Unix millisecond timestamp, corresponding to the number of milliseconds since January 1, 1970.',
		'timestamp',
		[ [ 'number', [ 'date' ] ] ]
	),
	generateFormulaInfo(
		'Returns an integer number, between 0 and 59, corresponding to minutes in the given date.',
		'minute',
		[ [ 'number', [ 'date' ] ] ]
	),
	generateFormulaInfo(
		'Returns an integer number, between 0 and 23, corresponding to hour for the given date.',
		'hour',
		[ [ 'number', [ 'date' ] ] ]
	),
	generateFormulaInfo(
		'Returns an integer number, between 1 and 31, corresponding to day of the month for the given.',
		'date',
		[ [ 'number', [ 'date' ] ] ]
	),
	generateFormulaInfo(
		'Returns an integer number corresponding to the day of the week for the given date: 0 for Sunday, 1 for Monday, 2 for Tuesday, and so on.',
		'day',
		[ [ 'number', [ 'date' ] ] ]
	),
	generateFormulaInfo(
		'Returns an integer number, between 0 and 11, corresponding to month in the given date according to local time. 0 corresponds to January, 1 to February, and so on.',
		'month',
		[ [ 'number', [ 'date' ] ] ]
	),
	generateFormulaInfo('Returns a number corresponding to the year of the given date.', 'year', [
		[ 'number', [ 'date' ] ]
	])
];

export const function_formula_info_map: Map<TFunctionName, IFunctionFormulaInfo> = new Map(
	function_formula_info_arr.map((function_formula_info) => [
		function_formula_info.function_name,
		function_formula_info
	])
);
