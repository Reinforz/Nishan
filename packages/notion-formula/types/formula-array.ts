import { TDateConstantValueType } from '@nishans/types';

// Formula Inputs
export type TFormulaArrayArgument =
	| TCheckboxArrayArgument
	| TTextArrayArgument
	| TNumberArrayArgument
	| TDateArrayArgument;

type Tuple2TFormulaArrayArgument =
	| Tuple2<TTextArrayArgument>
	| Tuple2<TCheckboxArrayArgument>
	| Tuple2<TDateArrayArgument>
	| Tuple2<TNumberArrayArgument>;

type Tuple2<T extends TFormulaArrayArgument> = [T, T];
type Tuple12<T1 extends TFormulaArrayArgument, T2 extends TFormulaArrayArgument> = [T1, T2, T2];

export type TCheckboxArrayArgument = boolean | TCheckboxFunctionArray | { property: string };
export type TNumberArrayArgument = 'e' | 'pi' | number | TNumberFunctionArray | { property: string };
export type TDateArrayArgument = TDateFunctionArray | { property: string };
export type TTextArrayArgument = string | TTextFunctionArray | { property: string };

export type NumberIfFunctionArray = ['if', Tuple12<TCheckboxArrayArgument, TNumberArrayArgument>];
export type TextIfFunctionArray = ['if', Tuple12<TCheckboxArrayArgument, TTextArrayArgument>];
export type CheckboxIfFunctionArray = ['if', Tuple12<TCheckboxArrayArgument, TCheckboxArrayArgument>];
export type DateIfFunctionArray = ['if', Tuple12<TCheckboxArrayArgument, TCheckboxArrayArgument>];
export type EqualFunctionArray = ['equal', Tuple2TFormulaArrayArgument];
export type UnequalFunctionArray = ['unequal', Tuple2TFormulaArrayArgument];
export type TextAddFunctionArray = ['add', Tuple2<TTextArrayArgument>];
export type NumberAddFunctionArray = ['add', Tuple2<TNumberArrayArgument>];
export type ReplaceAllFunctionArray = [
	'replaceAll',


		| Tuple12<TNumberArrayArgument, TTextArrayArgument>
		| Tuple12<TTextArrayArgument, TTextArrayArgument>
		| Tuple12<TCheckboxArrayArgument, TTextArrayArgument>
];
export type ReplaceFunctionArray = [
	'replace',


		| Tuple12<TNumberArrayArgument, TTextArrayArgument>
		| Tuple12<TTextArrayArgument, TTextArrayArgument>
		| Tuple12<TCheckboxArrayArgument, TTextArrayArgument>
];
export type ConcatFunctionArray = ['concat', TTextArrayArgument[]];
export type JoinFunctionArray = ['join', TTextArrayArgument[]];
export type SliceFunctionArray = [
	'slice',

	[TTextArrayArgument, TNumberArrayArgument, TNumberArrayArgument] | [TTextArrayArgument, TNumberArrayArgument]
];
export type FormatFunctionArray = ['format', [TFormulaArrayArgument]];
export type AndFunctionArray = ['and', Tuple2<TCheckboxArrayArgument>];
export type OrFunctionArray = ['or', Tuple2<TCheckboxArrayArgument>];
export type LargerFunctionArray = ['larger', Tuple2<TCheckboxArrayArgument>];
export type LargerEqFunctionArray = ['largerEq', Tuple2<TCheckboxArrayArgument>];
export type SmallerFunctionArray = ['smaller', Tuple2<TCheckboxArrayArgument>];
export type SmallerEqFunctionArray = ['smallerEq', Tuple2<TCheckboxArrayArgument>];
export type NotFunctionArray = ['not', [TCheckboxArrayArgument]];
export type SubtractFunctionArray = ['subtract', Tuple2<TNumberArrayArgument>];
export type DivideFunctionArray = ['divide', Tuple2<TNumberArrayArgument>];
export type MultiplyFunctionArray = ['multiply', Tuple2<TNumberArrayArgument>];
export type PowFunctionArray = ['pow', Tuple2<TNumberArrayArgument>];
export type ModFunctionArray = ['mod', Tuple2<TNumberArrayArgument>];
export type UnaryMinusFunctionArray = ['unaryMinus', [TNumberArrayArgument]];
export type UnaryPlusFunctionArray = ['unaryPlus', [TNumberArrayArgument]];
export type ContainsFunctionArray = ['contains', Tuple2<TTextArrayArgument>];
export type TestFunctionArray = [
	'test',


		| [TNumberArrayArgument, TTextArrayArgument]
		| [TTextArrayArgument, TTextArrayArgument]
		| [TCheckboxArrayArgument, TTextArrayArgument]
];

export type EmptyFunctionArray = ['empty', [TFormulaArrayArgument]];
export type AbsFunctionArray = ['abs', [TNumberArrayArgument]];
export type CbrtFunctionArray = ['cbrt', [TNumberArrayArgument]];
export type CeilFunctionArray = ['ceil', [TNumberArrayArgument]];
export type ExpFunctionArray = ['exp', [TNumberArrayArgument]];
export type FloorFunctionArray = ['floor', [TNumberArrayArgument]];
export type LnFunctionArray = ['ln', [TNumberArrayArgument]];
export type Log10FunctionArray = ['log10', [TNumberArrayArgument]];
export type Log2FunctionArray = ['log2', [TNumberArrayArgument]];
export type MaxFunctionArray = ['max', TNumberArrayArgument[]];
export type MinFunctionArray = ['min', TNumberArrayArgument[]];
export type RoundFunctionArray = ['round', [TNumberArrayArgument]];
export type SignFunctionArray = ['sign', [TNumberArrayArgument]];
export type SqrtFunctionArray = ['sqrt', [TNumberArrayArgument]];
export type StartFunctionArray = ['start', [TDateArrayArgument]];
export type EndFunctionArray = ['end', [TDateArrayArgument]];
export type DateAddFunctionArray = ['dateAdd', [TDateArrayArgument, TNumberArrayArgument, TDateConstantValueType]];
export type DateSubtractFunctionArray = [
	'dateSubtract',
	[TDateArrayArgument, TNumberArrayArgument, TDateConstantValueType]
];
export type DateBetweenFunctionArray = ['dateBetween', Tuple12<TDateArrayArgument, TDateConstantValueType>];
export type FormatDateFunctionArray = ['formatDate', [TDateArrayArgument, TTextArrayArgument]];

export type TimestampFunctionArray = ['timestamp', [TDateArrayArgument]];
export type FromTimestampFunctionArray = ['fromTimestamp', [TNumberArrayArgument]];
export type MinuteFunctionArray = ['minute', [TDateArrayArgument]];
export type HourFunctionArray = ['hour', [TDateArrayArgument]];
export type DayFunctionArray = ['day', [TDateArrayArgument]];
export type DateFunctionArray = ['date', [TDateArrayArgument]];
export type MonthFunctionArray = ['month', [TDateArrayArgument]];
export type YearFunctionArray = ['year', [TDateArrayArgument]];
export type LengthFunctionArray = ['length', [TTextArrayArgument]];
export type ToNumberFunctionArray = ['toNumber', [TFormulaArrayArgument]];
export type NowFunctionArray = ['now'];

export type TTextFunctionArray =
	| TextIfFunctionArray
	| TextAddFunctionArray
	| ReplaceAllFunctionArray
	| ReplaceFunctionArray
	| ConcatFunctionArray
	| JoinFunctionArray
	| SliceFunctionArray
	| FormatFunctionArray;

export type TCheckboxFunctionArray =
	| CheckboxIfFunctionArray
	| EqualFunctionArray
	| UnequalFunctionArray
	| AndFunctionArray
	| OrFunctionArray
	| LargerFunctionArray
	| LargerEqFunctionArray
	| SmallerFunctionArray
	| SmallerEqFunctionArray
	| NotFunctionArray
	| EmptyFunctionArray
	| TestFunctionArray
	| ContainsFunctionArray;

export type TNumberFunctionArray =
	| NumberAddFunctionArray
	| SubtractFunctionArray
	| DivideFunctionArray
	| MultiplyFunctionArray
	| PowFunctionArray
	| ModFunctionArray
	| UnaryMinusFunctionArray
	| UnaryPlusFunctionArray
	| NumberIfFunctionArray
	| DateBetweenFunctionArray
	| TimestampFunctionArray
	| SqrtFunctionArray
	| SignFunctionArray
	| RoundFunctionArray
	| MinFunctionArray
	| MaxFunctionArray
	| Log2FunctionArray
	| Log10FunctionArray
	| LnFunctionArray
	| FloorFunctionArray
	| ExpFunctionArray
	| CeilFunctionArray
	| CbrtFunctionArray
	| AbsFunctionArray
	| ToNumberFunctionArray
	| LengthFunctionArray;

export type TDateFunctionArray =
	| DateIfFunctionArray
	| FormatDateFunctionArray
	| DateSubtractFunctionArray
	| DateAddFunctionArray
	| NowFunctionArray
	| StartFunctionArray
	| EndFunctionArray
	| TimestampFunctionArray
	| FromTimestampFunctionArray
	| MinuteFunctionArray
	| HourFunctionArray
	| DayFunctionArray
	| DateFunctionArray
	| MonthFunctionArray
	| YearFunctionArray;

export type TFormulaArray = TDateFunctionArray | TTextFunctionArray | TNumberFunctionArray | TCheckboxFunctionArray;

export type FormulaArraySchemaUnitInput = {
	type: 'formula';
	name: string;
	formula: TFormulaArray;
};
