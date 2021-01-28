import { TDateConstantValueType } from '@nishans/types';

// Formula Inputs
export type AnyArrayResultType =
	| TCheckboxArrayResultType
	| TTextArrayResultType
	| TNumberArrayResultType
	| TDateArrayResultType;

type Tuple2AnyArrayResultType =
	| Tuple2<TTextArrayResultType>
	| Tuple2<TCheckboxArrayResultType>
	| Tuple2<TDateArrayResultType>
	| Tuple2<TNumberArrayResultType>;

type Tuple2<T extends AnyArrayResultType> = [T, T];
type Tuple12<T1 extends AnyArrayResultType, T2 extends AnyArrayResultType> = [T1, T2, T2];

export type TCheckboxArrayResultType = boolean | TCheckboxFunctionArrayCreateInput | { property: string };
export type TNumberArrayResultType = number | TNumberFunctionArrayCreateInput | { property: string };
export type TDateArrayResultType = Date | TDateFunctionArrayCreateInput | { property: string };
export type TTextArrayResultType = string | TTextFunctionArrayCreateInput | { property: string };

export type NumberIfFunctionArrayCreateInput = ['if', Tuple12<TCheckboxArrayResultType, TNumberArrayResultType>];
export type TextIfFunctionArrayCreateInput = ['if', Tuple12<TCheckboxArrayResultType, TTextArrayResultType>];
export type CheckboxIfFunctionArrayCreateInput = ['if', Tuple12<TCheckboxArrayResultType, TCheckboxArrayResultType>];
export type DateIfFunctionArrayCreateInput = ['if', Tuple12<TCheckboxArrayResultType, TCheckboxArrayResultType>];
export type EqualFunctionArrayCreateInput = ['equal', Tuple2AnyArrayResultType];
export type UnequalFunctionArrayCreateInput = ['unequal', Tuple2AnyArrayResultType];
export type TextAddFunctionArrayCreateInput = ['add', Tuple2<TTextArrayResultType>];
export type NumberAddFunctionArrayCreateInput = ['add', Tuple2<TNumberArrayResultType>];
export type ReplaceAllFunctionArrayCreateInput = [
	'replaceAll',


		| Tuple12<TNumberArrayResultType, TTextArrayResultType>
		| Tuple12<TTextArrayResultType, TTextArrayResultType>
		| Tuple12<TCheckboxArrayResultType, TTextArrayResultType>
];
export type ReplaceFunctionArrayCreateInput = [
	'replace',


		| Tuple12<TNumberArrayResultType, TTextArrayResultType>
		| Tuple12<TTextArrayResultType, TTextArrayResultType>
		| Tuple12<TCheckboxArrayResultType, TTextArrayResultType>
];
export type ConcatFunctionArrayCreateInput = ['concat', Tuple2<TTextArrayResultType>];
export type JoinFunctionArrayCreateInput = ['join', [TTextArrayResultType]];
export type SliceFunctionArrayCreateInput = [
	'slice',

		| [TTextArrayResultType, TNumberArrayResultType | TNumberArrayResultType]
		| [TTextArrayResultType | TNumberArrayResultType]
];
export type FormatFunctionArrayCreateInput = ['format', [AnyArrayResultType]];
export type AndFunctionArrayCreateInput = ['and', Tuple2<TCheckboxArrayResultType>];
export type OrFunctionArrayCreateInput = ['or', Tuple2<TCheckboxArrayResultType>];
export type LargerFunctionArrayCreateInput = ['larger', Tuple2<TCheckboxArrayResultType>];
export type LargerEqFunctionArrayCreateInput = ['largerEq', Tuple2<TCheckboxArrayResultType>];
export type SmallerFunctionArrayCreateInput = ['smaller', Tuple2<TCheckboxArrayResultType>];
export type SmallerEqFunctionArrayCreateInput = ['smallerEq', Tuple2<TCheckboxArrayResultType>];
export type NotFunctionArrayCreateInput = ['not', TCheckboxArrayResultType];
export type SubtractFunctionArrayCreateInput = ['subtract', Tuple2<TNumberArrayResultType>];
export type DivideFunctionArrayCreateInput = ['divide', Tuple2<TNumberArrayResultType>];
export type MultiplyFunctionArrayCreateInput = ['multiply', Tuple2<TNumberArrayResultType>];
export type PowFunctionArrayCreateInput = ['pow', Tuple2<TNumberArrayResultType>];
export type ModFunctionArrayCreateInput = ['mod', Tuple2<TNumberArrayResultType>];
export type UnaryMinusFunctionArrayCreateInput = ['unaryMinus', [TNumberArrayResultType]];
export type UnaryPlusFunctionArrayCreateInput = ['unaryPlus', [TNumberArrayResultType]];
export type ContainsFunctionArrayCreateInput = ['contains', Tuple2<TTextArrayResultType>];
export type TestFunctionArrayCreateInput = [
	'test',


		| [TNumberArrayResultType, TTextArrayResultType]
		| [TTextArrayResultType, TTextArrayResultType]
		| [TCheckboxArrayResultType, TTextArrayResultType]
];

export type EmptyFunctionArrayCreateInput = ['empty', [AnyArrayResultType]];
export type AbsFunctionArrayCreateInput = ['abs', [TNumberArrayResultType]];
export type CbrtFunctionArrayCreateInput = ['cbrt', [TNumberArrayResultType]];
export type CeilFunctionArrayCreateInput = ['ceil', [TNumberArrayResultType]];
export type ExpFunctionArrayCreateInput = ['exp', [TNumberArrayResultType]];
export type FloorFunctionArrayCreateInput = ['floor', [TNumberArrayResultType]];
export type LnFunctionArrayCreateInput = ['ln', [TNumberArrayResultType]];
export type Log10FunctionArrayCreateInput = ['log10', [TNumberArrayResultType]];
export type Log2FunctionArrayCreateInput = ['log2', [TNumberArrayResultType]];
export type MaxFunctionArrayCreateInput = ['max', [TNumberArrayResultType]];
export type MinFunctionArrayCreateInput = ['min', [TNumberArrayResultType]];
export type RoundFunctionArrayCreateInput = ['round', [TNumberArrayResultType]];
export type SignFunctionArrayCreateInput = ['sign', [TNumberArrayResultType]];
export type SqrtFunctionArrayCreateInput = ['sqrt', [TNumberArrayResultType]];
export type StartFunctionArrayCreateInput = ['start', [TDateArrayResultType]];
export type EndFunctionArrayCreateInput = ['end', [TDateArrayResultType]];
export type DateAddFunctionArrayCreateInput = [
	'dateAdd',
	[TDateArrayResultType, TNumberArrayResultType, TDateConstantValueType]
];
export type DateSubtractFunctionArrayCreateInput = [
	'dateSubtract',
	[TDateArrayResultType, TNumberArrayResultType, TDateConstantValueType]
];
export type DateBetweenFunctionArrayCreateInput = [
	'dateBetween',
	Tuple12<TDateArrayResultType, TDateConstantValueType>
];
export type FormatDateFunctionArrayCreateInput = ['formatDate', [TDateArrayResultType, TTextArrayResultType]];

export type TimestampFunctionArrayCreateInput = ['timestamp', [TDateArrayResultType]];
export type FromTimestampFunctionArrayCreateInput = ['fromTimestamp', [TNumberArrayResultType]];
export type MinuteFunctionArrayCreateInput = ['minute', [TDateArrayResultType]];
export type HourFunctionArrayCreateInput = ['hour', [TDateArrayResultType]];
export type DayFunctionArrayCreateInput = ['day', [TDateArrayResultType]];
export type DateFunctionArrayCreateInput = ['date', [TDateArrayResultType]];
export type MonthFunctionArrayCreateInput = ['month', [TDateArrayResultType]];
export type YearFunctionArrayCreateInput = ['year', [TDateArrayResultType]];
export type LengthFunctionArrayCreateInput = ['length', [TTextArrayResultType]];
export type ToNumberFunctionArrayCreateInput = ['toNumber', [AnyArrayResultType]];
export type NowFunctionArrayCreateInput = ['now'];

export type TTextFunctionArrayCreateInput =
	| TextIfFunctionArrayCreateInput
	| TextAddFunctionArrayCreateInput
	| ReplaceAllFunctionArrayCreateInput
	| ReplaceFunctionArrayCreateInput
	| ConcatFunctionArrayCreateInput
	| JoinFunctionArrayCreateInput
	| SliceFunctionArrayCreateInput
	| FormatFunctionArrayCreateInput;

export type TCheckboxFunctionArrayCreateInput =
	| CheckboxIfFunctionArrayCreateInput
	| EqualFunctionArrayCreateInput
	| UnequalFunctionArrayCreateInput
	| AndFunctionArrayCreateInput
	| OrFunctionArrayCreateInput
	| LargerFunctionArrayCreateInput
	| LargerEqFunctionArrayCreateInput
	| SmallerFunctionArrayCreateInput
	| SmallerEqFunctionArrayCreateInput
	| NotFunctionArrayCreateInput
	| EmptyFunctionArrayCreateInput
	| TestFunctionArrayCreateInput
	| ContainsFunctionArrayCreateInput;

export type TNumberFunctionArrayCreateInput =
	| NumberAddFunctionArrayCreateInput
	| SubtractFunctionArrayCreateInput
	| DivideFunctionArrayCreateInput
	| MultiplyFunctionArrayCreateInput
	| PowFunctionArrayCreateInput
	| ModFunctionArrayCreateInput
	| UnaryMinusFunctionArrayCreateInput
	| UnaryPlusFunctionArrayCreateInput
	| NumberIfFunctionArrayCreateInput
	| DateBetweenFunctionArrayCreateInput
	| TimestampFunctionArrayCreateInput
	| SqrtFunctionArrayCreateInput
	| SignFunctionArrayCreateInput
	| RoundFunctionArrayCreateInput
	| MinFunctionArrayCreateInput
	| MaxFunctionArrayCreateInput
	| Log2FunctionArrayCreateInput
	| Log10FunctionArrayCreateInput
	| LnFunctionArrayCreateInput
	| FloorFunctionArrayCreateInput
	| ExpFunctionArrayCreateInput
	| CeilFunctionArrayCreateInput
	| CbrtFunctionArrayCreateInput
	| AbsFunctionArrayCreateInput
	| ToNumberFunctionArrayCreateInput
	| LengthFunctionArrayCreateInput;

export type TDateFunctionArrayCreateInput =
	| DateIfFunctionArrayCreateInput
	| FormatDateFunctionArrayCreateInput
	| DateSubtractFunctionArrayCreateInput
	| DateAddFunctionArrayCreateInput
	| NowFunctionArrayCreateInput
	| StartFunctionArrayCreateInput
	| EndFunctionArrayCreateInput
	| TimestampFunctionArrayCreateInput
	| FromTimestampFunctionArrayCreateInput
	| MinuteFunctionArrayCreateInput
	| HourFunctionArrayCreateInput
	| DayFunctionArrayCreateInput
	| DateFunctionArrayCreateInput
	| MonthFunctionArrayCreateInput
	| YearFunctionArrayCreateInput;

export type TFormulaArrayCreateInput =
	| TDateFunctionArrayCreateInput
	| TTextFunctionArrayCreateInput
	| TNumberFunctionArrayCreateInput
	| TCheckboxFunctionArrayCreateInput;

export type FormulaArraySchemaUnitInput = {
	type: 'formula';
	name: string;
	formula: TFormulaArrayCreateInput;
};
