import { TDateConstantValueType, TFunctionName, TSchemaUnit } from '@nishans/types';

export type ISchemaMapValue = { schema_id: string } & TSchemaUnit;
export type ISchemaMap = Map<string, ISchemaMapValue>;

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
export type TNumberResultType = 'pi' | 'e' | number | TNumberFunctionCreateInput | { property: string };
export type TDateResultType = TDateFunctionCreateInput | { property: string };
export type TTextResultType = string | TTextFunctionCreateInput | { property: string };

interface IFunctionCreateInput<F extends TFunctionName, A extends any[]> {
	function: F;
	args: A;
}

export type NumberIfFunctionCreateInput = IFunctionCreateInput<'if', Tuple12<TCheckboxResultType, TNumberResultType>>;
export type TextIfFunctionCreateInput = IFunctionCreateInput<'if', Tuple12<TCheckboxResultType, TTextResultType>>;
export type CheckboxIfFunctionCreateInput = IFunctionCreateInput<
	'if',
	Tuple12<TCheckboxResultType, TCheckboxResultType>
>;
export type DateIfFunctionCreateInput = IFunctionCreateInput<'if', Tuple12<TCheckboxResultType, TDateResultType>>;
export type EqualFunctionCreateInput = IFunctionCreateInput<'equal', Tuple2AnyResultType>;
export type UnequalFunctionCreateInput = IFunctionCreateInput<'unequal', Tuple2AnyResultType>;
export type TextAddFunctionCreateInput = IFunctionCreateInput<'add', Tuple2<TTextResultType>>;
export type NumberAddFunctionCreateInput = IFunctionCreateInput<'add', Tuple2<TNumberResultType>>;
export type ReplaceAllFunctionCreateInput = IFunctionCreateInput<
	'replaceAll',
	| Tuple12<TNumberResultType, TTextResultType>
	| Tuple12<TTextResultType, TTextResultType>
	| Tuple12<TCheckboxResultType, TTextResultType>
>;
export type ReplaceFunctionCreateInput = IFunctionCreateInput<
	'replace',
	| Tuple12<TNumberResultType, TTextResultType>
	| Tuple12<TTextResultType, TTextResultType>
	| Tuple12<TCheckboxResultType, TTextResultType>
>;
export type ConcatFunctionCreateInput = IFunctionCreateInput<'concat', Tuple2<TTextResultType>>;
export type JoinFunctionCreateInput = IFunctionCreateInput<'join', TTextResultType[]>;
export type SliceFunctionCreateInput = IFunctionCreateInput<
	'slice',
	[TTextResultType, TNumberResultType, TNumberResultType] | [TTextResultType, TNumberResultType]
>;
export type FormatFunctionCreateInput = IFunctionCreateInput<'format', [TResultType]>;
export type AndFunctionCreateInput = IFunctionCreateInput<'and', Tuple2<TCheckboxResultType>>;
export type OrFunctionCreateInput = IFunctionCreateInput<'or', Tuple2<TCheckboxResultType>>;
export type LargerFunctionCreateInput = IFunctionCreateInput<'larger', Tuple2<TCheckboxResultType>>;
export type LargerEqFunctionCreateInput = IFunctionCreateInput<'largerEq', Tuple2<TCheckboxResultType>>;
export type SmallerFunctionCreateInput = IFunctionCreateInput<'smaller', Tuple2<TCheckboxResultType>>;
export type SmallerEqFunctionCreateInput = IFunctionCreateInput<'smallerEq', Tuple2<TCheckboxResultType>>;
export type NotFunctionCreateInput = IFunctionCreateInput<'not', [TCheckboxResultType]>;
export type SubtractFunctionCreateInput = IFunctionCreateInput<'subtract', Tuple2<TNumberResultType>>;
export type DivideFunctionCreateInput = IFunctionCreateInput<'divide', Tuple2<TNumberResultType>>;
export type MultiplyFunctionCreateInput = IFunctionCreateInput<'multiply', Tuple2<TNumberResultType>>;
export type PowFunctionCreateInput = IFunctionCreateInput<'pow', Tuple2<TNumberResultType>>;
export type ModFunctionCreateInput = IFunctionCreateInput<'mod', Tuple2<TNumberResultType>>;
export type UnaryMinusFunctionCreateInput = IFunctionCreateInput<'unaryMinus', [TNumberResultType]>;
export type UnaryPlusFunctionCreateInput = IFunctionCreateInput<'unaryPlus', [TNumberResultType]>;
export type ContainsFunctionCreateInput = IFunctionCreateInput<'contains', Tuple2<TTextResultType>>;
export type TestFunctionCreateInput = IFunctionCreateInput<
	'test',
	[TNumberResultType, TTextResultType] | [TTextResultType, TTextResultType] | [TCheckboxResultType, TTextResultType]
>;
export type EmptyFunctionCreateInput = IFunctionCreateInput<'empty', [TResultType]>;
export type AbsFunctionCreateInput = IFunctionCreateInput<'abs', [TNumberResultType]>;
export type CbrtFunctionCreateInput = IFunctionCreateInput<'cbrt', [TNumberResultType]>;
export type CeilFunctionCreateInput = IFunctionCreateInput<'ceil', [TNumberResultType]>;
export type ExpFunctionCreateInput = IFunctionCreateInput<'exp', [TNumberResultType]>;
export type FloorFunctionCreateInput = IFunctionCreateInput<'floor', [TNumberResultType]>;
export type LnFunctionCreateInput = IFunctionCreateInput<'ln', [TNumberResultType]>;
export type Log10FunctionCreateInput = IFunctionCreateInput<'log10', [TNumberResultType]>;
export type Log2FunctionCreateInput = IFunctionCreateInput<'log2', [TNumberResultType]>;
export type MaxFunctionCreateInput = IFunctionCreateInput<'max', [TNumberResultType]>;
export type MinFunctionCreateInput = IFunctionCreateInput<'min', [TNumberResultType]>;
export type RoundFunctionCreateInput = IFunctionCreateInput<'round', [TNumberResultType]>;
export type SignFunctionCreateInput = IFunctionCreateInput<'sign', [TNumberResultType]>;
export type SqrtFunctionCreateInput = IFunctionCreateInput<'sqrt', [TNumberResultType]>;
export type StartFunctionCreateInput = IFunctionCreateInput<'start', [TDateResultType]>;
export type EndFunctionCreateInput = IFunctionCreateInput<'end', [TDateResultType]>;
export type DateAddFunctionCreateInput = IFunctionCreateInput<
	'dateAdd',
	[TDateResultType, TNumberResultType, TDateConstantValueType]
>;
export type DateSubtractFunctionCreateInput = IFunctionCreateInput<
	'dateSubtract',
	[TDateResultType, TNumberResultType, TDateConstantValueType]
>;
export type DateBetweenFunctionCreateInput = IFunctionCreateInput<
	'dateBetween',
	Tuple12<TDateResultType, TDateConstantValueType>
>;
export type FormatDateFunctionCreateInput = IFunctionCreateInput<'formatDate', [TDateResultType, TTextResultType]>;
export type TimestampFunctionCreateInput = IFunctionCreateInput<'timestamp', [TDateResultType]>;
export type FromTimestampFunctionCreateInput = IFunctionCreateInput<'fromTimestamp', [TNumberResultType]>;
export type MinuteFunctionCreateInput = IFunctionCreateInput<'minute', [TDateResultType]>;
export type HourFunctionCreateInput = IFunctionCreateInput<'hour', [TDateResultType]>;
export type DayFunctionCreateInput = IFunctionCreateInput<'day', [TDateResultType]>;
export type DateFunctionCreateInput = IFunctionCreateInput<'date', [TDateResultType]>;
export type MonthFunctionCreateInput = IFunctionCreateInput<'month', [TDateResultType]>;
export type YearFunctionCreateInput = IFunctionCreateInput<'year', [TDateResultType]>;
export type LengthFunctionCreateInput = IFunctionCreateInput<'length', [TTextResultType]>;
export type ToNumberFunctionCreateInput = IFunctionCreateInput<'toNumber', [TResultType]>;
export type NowFunctionCreateInput = {
	function: 'now';
	args?: [];
};

export type TTextFunctionCreateInput =
	| TextIfFunctionCreateInput
	| TextAddFunctionCreateInput
	| ReplaceAllFunctionCreateInput
	| ReplaceFunctionCreateInput
	| ConcatFunctionCreateInput
	| JoinFunctionCreateInput
	| SliceFunctionCreateInput
	| FormatFunctionCreateInput;

export type TCheckboxFunctionCreateInput =
	| CheckboxIfFunctionCreateInput
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
	| NumberAddFunctionCreateInput
	| SubtractFunctionCreateInput
	| DivideFunctionCreateInput
	| MultiplyFunctionCreateInput
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
	| DateIfFunctionCreateInput
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

export type FormulaSchemaUnitInput = {
	type: 'formula';
	name: string;
	formula: TFormulaCreateInput;
};
