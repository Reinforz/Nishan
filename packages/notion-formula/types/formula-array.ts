import { TDateConstantValueType, TFunctionName } from '@nishans/types';

// Formula Inputs
export type TArrayResultType =
	| TCheckboxArrayResultType
	| TTextArrayResultType
	| TNumberArrayResultType
	| TDateArrayResultType;

type Tuple2AnyArrayResultType =
	| Tuple2<TTextArrayResultType>
	| Tuple2<TCheckboxArrayResultType>
	| Tuple2<TDateArrayResultType>
	| Tuple2<TNumberArrayResultType>;

type Tuple2<T extends TArrayResultType> = [T, T];
type Tuple12<T1 extends TArrayResultType, T2 extends TArrayResultType> = [T1, T2, T2];

export type TCheckboxArrayResultType = boolean | TCheckboxFunctionArrayCreateInput | { property: string };
export type TNumberArrayResultType = number | TNumberFunctionArrayCreateInput | { property: string };
export type TDateArrayResultType = Date | TDateFunctionArrayCreateInput | { property: string };
export type TTextArrayResultType = string | TTextFunctionArrayCreateInput | { property: string };

interface IFunctionArrayCreateInput<F extends TFunctionName, A> {
	function: F;
	args: A;
}

export type NumberIfFunctionArrayCreateInput = {
	function: 'if';
	result_type: 'number';
	args: Tuple12<TCheckboxArrayResultType, TNumberArrayResultType>;
};

export type TextIfFunctionArrayCreateInput = {
	function: 'if';
	result_type: 'text';
	args: Tuple12<TCheckboxArrayResultType, TTextArrayResultType>;
};

export type CheckboxIfFunctionArrayCreateInput = {
	function: 'if';
	result_type: 'checkbox';
	args: Tuple12<TCheckboxArrayResultType, TCheckboxArrayResultType>;
};

export type DateIfFunctionArrayCreateInput = {
	function: 'if';
	result_type: 'date';
	args: Tuple12<TCheckboxArrayResultType, TDateArrayResultType>;
};

export type EqualFunctionArrayCreateInput = IFunctionArrayCreateInput<'equal', Tuple2AnyArrayResultType>;
export type UnequalFunctionArrayCreateInput = IFunctionArrayCreateInput<'unequal', Tuple2AnyArrayResultType>;
export type TextAddFunctionArrayCreateInput = {
	function: 'add';
	args: Tuple2<TTextArrayResultType>;
	result_type: 'text';
};

export type NumberAddFunctionArrayCreateInput = {
	function: 'add';
	args: Tuple2<TNumberArrayResultType>;
	result_type: 'number';
};

export type ReplaceAllFunctionArrayCreateInput = IFunctionArrayCreateInput<
	'replaceAll',
	| Tuple12<TNumberArrayResultType, TTextArrayResultType>
	| Tuple12<TTextArrayResultType, TTextArrayResultType>
	| Tuple12<TCheckboxArrayResultType, TTextArrayResultType>
>;
export type ReplaceFunctionArrayCreateInput = IFunctionArrayCreateInput<
	'replace',
	| Tuple12<TNumberArrayResultType, TTextArrayResultType>
	| Tuple12<TTextArrayResultType, TTextArrayResultType>
	| Tuple12<TCheckboxArrayResultType, TTextArrayResultType>
>;
export type ConcatFunctionArrayCreateInput = IFunctionArrayCreateInput<'concat', Tuple2<TTextArrayResultType>>;
export type JoinFunctionArrayCreateInput = IFunctionArrayCreateInput<'join', TTextArrayResultType>;
export type SliceFunctionArrayCreateInput = IFunctionArrayCreateInput<
	'slice',
	[TTextArrayResultType, TNumberArrayResultType] | TNumberArrayResultType
>;
export type FormatFunctionArrayCreateInput = IFunctionArrayCreateInput<'format', TArrayResultType>;
export type AndFunctionArrayCreateInput = IFunctionArrayCreateInput<'and', Tuple2<TCheckboxArrayResultType>>;
export type OrFunctionArrayCreateInput = IFunctionArrayCreateInput<'or', Tuple2<TCheckboxArrayResultType>>;
export type LargerFunctionArrayCreateInput = IFunctionArrayCreateInput<'larger', Tuple2<TCheckboxArrayResultType>>;
export type LargerEqFunctionArrayCreateInput = IFunctionArrayCreateInput<'largerEq', Tuple2<TCheckboxArrayResultType>>;
export type SmallerFunctionArrayCreateInput = IFunctionArrayCreateInput<'smaller', Tuple2<TCheckboxArrayResultType>>;
export type SmallerEqFunctionArrayCreateInput = IFunctionArrayCreateInput<
	'smallerEq',
	Tuple2<TCheckboxArrayResultType>
>;
export type NotFunctionArrayCreateInput = IFunctionArrayCreateInput<'not', TCheckboxArrayResultType>;
export type SubtractFunctionArrayCreateInput = IFunctionArrayCreateInput<'subtract', Tuple2<TNumberArrayResultType>>;
export type DivideFunctionArrayCreateInput = IFunctionArrayCreateInput<'divide', Tuple2<TNumberArrayResultType>>;
export type MultiplyFunctionArrayCreateInput = IFunctionArrayCreateInput<'multiply', Tuple2<TNumberArrayResultType>>;
export type PowFunctionArrayCreateInput = IFunctionArrayCreateInput<'pow', Tuple2<TNumberArrayResultType>>;
export type ModFunctionArrayCreateInput = IFunctionArrayCreateInput<'mod', Tuple2<TNumberArrayResultType>>;
export type UnaryMinusFunctionArrayCreateInput = IFunctionArrayCreateInput<'unaryMinus', TNumberArrayResultType>;
export type UnaryPlusFunctionArrayCreateInput = IFunctionArrayCreateInput<'unaryPlus', TNumberArrayResultType>;
export type ContainsFunctionArrayCreateInput = IFunctionArrayCreateInput<'contains', Tuple2<TTextArrayResultType>>;
export type TestFunctionArrayCreateInput = IFunctionArrayCreateInput<
	'test',
	| [TNumberArrayResultType, TTextArrayResultType]
	| [TTextArrayResultType, TTextArrayResultType]
	| [TCheckboxArrayResultType, TTextArrayResultType]
>;
export type EmptyFunctionArrayCreateInput = IFunctionArrayCreateInput<'empty', TArrayResultType>;
export type AbsFunctionArrayCreateInput = IFunctionArrayCreateInput<'abs', TNumberArrayResultType>;
export type CbrtFunctionArrayCreateInput = IFunctionArrayCreateInput<'cbrt', TNumberArrayResultType>;
export type CeilFunctionArrayCreateInput = IFunctionArrayCreateInput<'ceil', TNumberArrayResultType>;
export type ExpFunctionArrayCreateInput = IFunctionArrayCreateInput<'exp', TNumberArrayResultType>;
export type FloorFunctionArrayCreateInput = IFunctionArrayCreateInput<'floor', TNumberArrayResultType>;
export type LnFunctionArrayCreateInput = IFunctionArrayCreateInput<'ln', TNumberArrayResultType>;
export type Log10FunctionArrayCreateInput = IFunctionArrayCreateInput<'log10', TNumberArrayResultType>;
export type Log2FunctionArrayCreateInput = IFunctionArrayCreateInput<'log2', TNumberArrayResultType>;
export type MaxFunctionArrayCreateInput = IFunctionArrayCreateInput<'max', TNumberArrayResultType>;
export type MinFunctionArrayCreateInput = IFunctionArrayCreateInput<'min', TNumberArrayResultType>;
export type RoundFunctionArrayCreateInput = IFunctionArrayCreateInput<'round', TNumberArrayResultType>;
export type SignFunctionArrayCreateInput = IFunctionArrayCreateInput<'sign', TNumberArrayResultType>;
export type SqrtFunctionArrayCreateInput = IFunctionArrayCreateInput<'sqrt', TNumberArrayResultType>;
export type StartFunctionArrayCreateInput = IFunctionArrayCreateInput<'start', TDateArrayResultType>;
export type EndFunctionArrayCreateInput = IFunctionArrayCreateInput<'end', TDateArrayResultType>;
export type DateAddFunctionArrayCreateInput = IFunctionArrayCreateInput<
	'dateAdd',
	[TDateArrayResultType, TNumberArrayResultType, TDateConstantValueType]
>;
export type DateSubtractFunctionArrayCreateInput = IFunctionArrayCreateInput<
	'dateSubtract',
	[TDateArrayResultType, TNumberArrayResultType, TDateConstantValueType]
>;
export type DateBetweenFunctionArrayCreateInput = IFunctionArrayCreateInput<
	'dateBetween',
	Tuple12<TDateArrayResultType, TDateConstantValueType>
>;
export type FormatDateFunctionArrayCreateInput = IFunctionArrayCreateInput<
	'formatDate',
	[TDateArrayResultType, TTextArrayResultType]
>;
export type TimestampFunctionArrayCreateInput = IFunctionArrayCreateInput<'timestamp', TDateArrayResultType>;
export type FromTimestampFunctionArrayCreateInput = IFunctionArrayCreateInput<'fromTimestamp', TNumberArrayResultType>;
export type MinuteFunctionArrayCreateInput = IFunctionArrayCreateInput<'minute', TDateArrayResultType>;
export type HourFunctionArrayCreateInput = IFunctionArrayCreateInput<'hour', TDateArrayResultType>;
export type DayFunctionArrayCreateInput = IFunctionArrayCreateInput<'day', TDateArrayResultType>;
export type DateFunctionArrayCreateInput = IFunctionArrayCreateInput<'date', TDateArrayResultType>;
export type MonthFunctionArrayCreateInput = IFunctionArrayCreateInput<'month', TDateArrayResultType>;
export type YearFunctionArrayCreateInput = IFunctionArrayCreateInput<'year', TDateArrayResultType>;
export type LengthFunctionArrayCreateInput = IFunctionArrayCreateInput<'length', TTextArrayResultType>;
export type ToNumberFunctionArrayCreateInput = IFunctionArrayCreateInput<'toNumber', TArrayResultType>;
export type NowFunctionArrayCreateInput = {
	function: 'now';
	args?: [];
};

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
