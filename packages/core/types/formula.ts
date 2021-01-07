import { IConstantFormula, TDateConstantValueType } from '@nishans/types';

// Formula Inputs
export type TResultType = TCheckboxResultType | TTextResultType | TNumberResultType | TDateResultType;

type Tuple2AnyResultType =
	| Tuple2<TTextResultType>
	| Tuple2<TCheckboxResultType>
	| Tuple2<TDateResultType>
	| Tuple2<TNumberResultType>;

type Tuple2<T extends TResultType> = [T, T];
type Tuple12<T1 extends TResultType, T2 extends TResultType> = [T1, T2, T2];

export type TCheckboxResultType = boolean | TCheckboxFunctionCreateInput | { property: string };
export type TNumberResultType = number | TNumberFunctionCreateInput | { property: string };
export type TDateResultType = TDateFunctionCreateInput | { property: string };
export type TTextResultType = string | TTextFunctionCreateInput | { property: string };

export type NumberIfFunctionCreateInput = ['if', [TCheckboxResultType, TNumberResultType, TNumberResultType]];

export type TextIfFunctionCreateInput = ['if', [TCheckboxResultType, TTextResultType, TTextResultType]];

export type EqualFunctionCreateInput = ['equal', Tuple2AnyResultType];
export type UnequalFunctionCreateInput = ['equal', Tuple2AnyResultType];
export type AddFunctionCreateInput = ['add', Tuple2<TTextResultType> | Tuple2<TNumberResultType>];
export type ReplaceAllFunctionCreateInput = [
	'replaceAll',


		| Tuple12<TNumberResultType, TTextResultType>
		| Tuple12<TTextResultType, TTextResultType>
		| Tuple12<TCheckboxResultType, TTextResultType>
];
export type ReplaceFunctionCreateInput = [
	'replace',


		| Tuple12<TNumberResultType, TTextResultType>
		| Tuple12<TTextResultType, TTextResultType>
		| Tuple12<TCheckboxResultType, TTextResultType>
];

export type ConcatFunctionCreateInput = ['concat', Tuple2<TTextResultType>];
export type JoinFunctionCreateInput = ['join', Array<IConstantFormula<'text', 'string'>>];
export type SliceFunctionCreateInput = ['slice', Tuple12<string, number>];
export type FormatFunctionCreateInput = ['format', [TResultType]];
export type AndFunctionCreateInput = ['and', Tuple2<TCheckboxResultType>];
export type OrFunctionCreateInput = ['or', Tuple2<TCheckboxResultType>];
export type LargerFunctionCreateInput = ['larger', Tuple2<TCheckboxResultType>];
export type LargerEqFunctionCreateInput = ['largerEq', Tuple2<TCheckboxResultType>];
export type SmallerFunctionCreateInput = ['smaller', Tuple2<TCheckboxResultType>];
export type SmallerEqFunctionCreateInput = ['smallerEq', Tuple2<TCheckboxResultType>];
export type NotFunctionCreateInput = ['not', [TCheckboxResultType]];

export type SubtractFunctionCreateInput = ['subtract', Tuple2<TNumberResultType>];
export type DivideFunctionCreateInput = ['divide', Tuple2<TNumberResultType>];
export type MultipleFunctionCreateInput = ['multiple', Tuple2<TNumberResultType>];
export type PowFunctionCreateInput = ['pow', Tuple2<TNumberResultType>];
export type ModFunctionCreateInput = ['mod', Tuple2<TNumberResultType>];
export type UnaryMinusFunctionCreateInput = ['unaryMinus', [TNumberResultType]];
export type UnaryPlusFunctionCreateInput = ['unaryPlus', [TNumberResultType]];
export type ContainsFunctionCreateInput = ['contains', Tuple2<TTextResultType>];
export type TestFunctionCreateInput = [
	'test',
	[TNumberResultType, TTextResultType] | [TTextResultType, TTextResultType] | [TCheckboxResultType, TTextResultType]
];
export type EmptyFunctionCreateInput = [
	'empty',
	[TNumberResultType] | [TTextResultType] | [TDateResultType] | [TCheckboxResultType]
];

export type AbsFunctionCreateInput = ['abs', [TNumberResultType]];
export type CbrtFunctionCreateInput = ['cbrt', [TNumberResultType]];
export type CeilFunctionCreateInput = ['ceil', [TNumberResultType]];
export type ExpFunctionCreateInput = ['exp', [TNumberResultType]];
export type FloorFunctionCreateInput = ['floor', [TNumberResultType]];
export type LnFunctionCreateInput = ['ln', [TNumberResultType]];
export type Log10FunctionCreateInput = ['log10', [TNumberResultType]];
export type Log2FunctionCreateInput = ['log2', [TNumberResultType]];
export type MaxFunctionCreateInput = ['max', [TNumberResultType]];
export type MinFunctionCreateInput = ['min', [TNumberResultType]];
export type RoundFunctionCreateInput = ['round', [TNumberResultType]];
export type SignFunctionCreateInput = ['sign', [TNumberResultType]];
export type SqrtFunctionCreateInput = ['sqrt', [TNumberResultType]];
export type StartFunctionCreateInput = ['start', [TDateResultType]];
export type EndFunctionCreateInput = ['end', [TDateResultType]];
export type DateAddFunctionCreateInput = ['dateAdd', [TDateResultType, TNumberResultType, TDateConstantValueType]];
export type DateSubtractFunctionCreateInput = [
	'dateSubtract',
	[TDateResultType, TNumberResultType, TDateConstantValueType]
];

export type DateBetweenFunctionCreateInput = ['dateBetween', Tuple12<TDateResultType, TDateConstantValueType>];
export type FormatDateFunctionCreateInput = ['formatDate', [TDateResultType, string]];
export type TimestampFunctionCreateInput = ['timestamp', [TDateResultType]];

export type FromTimestampFunctionCreateInput = ['fromTimestamp', [TNumberResultType]];
export type MinuteFunctionCreateInput = ['minute', [TDateResultType]];
export type HourFunctionCreateInput = ['hour', [TDateResultType]];
export type DayFunctionCreateInput = ['day', [TDateResultType]];
export type DateFunctionCreateInput = ['date', [TDateResultType]];
export type MonthFunctionCreateInput = ['month', [TDateResultType]];
export type YearFunctionCreateInput = ['year', [TDateResultType]];
export type LengthFunctionCreateInput = ['length', [TTextResultType]];
export type ToNumberFunctionCreateInput = ['toNumber', [TResultType]];
export type NowFunctionCreateInput = 'now';

export type TTextFunctionCreateInput =
	| TextIfFunctionCreateInput
	| AddFunctionCreateInput
	| ReplaceAllFunctionCreateInput
	| ReplaceFunctionCreateInput
	| ConcatFunctionCreateInput
	| JoinFunctionCreateInput
	| SliceFunctionCreateInput
	| FormatFunctionCreateInput;

export type TCheckboxFunctionCreateInput =
	| EqualFunctionCreateInput
	| UnequalFunctionCreateInput
	| AndFunctionCreateInput
	| OrFunctionCreateInput
	| LargerFunctionCreateInput
	| LargerEqFunctionCreateInput
	| SmallerFunctionCreateInput
	| SmallerEqFunctionCreateInput
	| NotFunctionCreateInput
	| EmptyFunctionCreateInput
	| TestFunctionCreateInput
	| ContainsFunctionCreateInput;

export type TNumberFunctionCreateInput =
	| SubtractFunctionCreateInput
	| DivideFunctionCreateInput
	| MultipleFunctionCreateInput
	| PowFunctionCreateInput
	| ModFunctionCreateInput
	| UnaryMinusFunctionCreateInput
	| UnaryPlusFunctionCreateInput
	| NumberIfFunctionCreateInput
	| DateBetweenFunctionCreateInput
	| TimestampFunctionCreateInput
	| SqrtFunctionCreateInput
	| SignFunctionCreateInput
	| RoundFunctionCreateInput
	| MinFunctionCreateInput
	| MaxFunctionCreateInput
	| Log2FunctionCreateInput
	| Log10FunctionCreateInput
	| LnFunctionCreateInput
	| FloorFunctionCreateInput
	| ExpFunctionCreateInput
	| CeilFunctionCreateInput
	| CbrtFunctionCreateInput
	| AbsFunctionCreateInput
	| ToNumberFunctionCreateInput
	| LengthFunctionCreateInput;

export type TDateFunctionCreateInput =
	| FormatDateFunctionCreateInput
	| DateSubtractFunctionCreateInput
	| DateAddFunctionCreateInput
	| NowFunctionCreateInput
	| StartFunctionCreateInput
	| EndFunctionCreateInput
	| TimestampFunctionCreateInput
	| FromTimestampFunctionCreateInput
	| MinuteFunctionCreateInput
	| HourFunctionCreateInput
	| DayFunctionCreateInput
	| DateFunctionCreateInput
	| MonthFunctionCreateInput
	| YearFunctionCreateInput;

export type TFormulaCreateInput =
	| TDateFunctionCreateInput
	| TTextFunctionCreateInput
	| TNumberFunctionCreateInput
	| TCheckboxFunctionCreateInput;
