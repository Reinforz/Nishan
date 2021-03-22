import { TDateConstantValueType, TFunctionName } from '@nishans/types';

// Formula Inputs
export type TFormulaObjectArgument =
	| TCheckboxObjectArgument
	| TTextObjectArgument
	| TNumberObjectArgument
	| TDateObjectArgument;

type Tuple2AnyObjectArgument =
	| Tuple2<TTextObjectArgument>
	| Tuple2<TCheckboxObjectArgument>
	| Tuple2<TDateObjectArgument>
	| Tuple2<TNumberObjectArgument>;

type Tuple2<T extends TFormulaObjectArgument> = [T, T];
type Tuple12<T1 extends TFormulaObjectArgument, T2 extends TFormulaObjectArgument> = [T1, T2, T2];

export type TCheckboxObjectArgument = boolean | TCheckboxFunctionObject | { property: string };
export type TNumberObjectArgument = 'pi' | 'e' | number | TNumberFunctionObject | { property: string };
export type TDateObjectArgument = TDateFunctionObject | { property: string };
export type TTextObjectArgument = string | TTextFunctionObject | { property: string };

interface IFunctionObject<F extends TFunctionName, A extends any[]> {
	function: F;
	args: A;
}

export type NumberIfFunctionObject = IFunctionObject<'if', Tuple12<TCheckboxObjectArgument, TNumberObjectArgument>>;
export type TextIfFunctionObject = IFunctionObject<'if', Tuple12<TCheckboxObjectArgument, TTextObjectArgument>>;
export type CheckboxIfFunctionObject = IFunctionObject<'if', Tuple12<TCheckboxObjectArgument, TCheckboxObjectArgument>>;
export type DateIfFunctionObject = IFunctionObject<'if', Tuple12<TCheckboxObjectArgument, TDateObjectArgument>>;
export type EqualFunctionObject = IFunctionObject<'equal', Tuple2AnyObjectArgument>;
export type UnequalFunctionObject = IFunctionObject<'unequal', Tuple2AnyObjectArgument>;
export type TextAddFunctionObject = IFunctionObject<'add', Tuple2<TTextObjectArgument>>;
export type NumberAddFunctionObject = IFunctionObject<'add', Tuple2<TNumberObjectArgument>>;
export type ReplaceAllFunctionObject = IFunctionObject<
	'replaceAll',
	| Tuple12<TNumberObjectArgument, TTextObjectArgument>
	| Tuple12<TTextObjectArgument, TTextObjectArgument>
	| Tuple12<TCheckboxObjectArgument, TTextObjectArgument>
>;
export type ReplaceFunctionObject = IFunctionObject<
	'replace',
	| Tuple12<TNumberObjectArgument, TTextObjectArgument>
	| Tuple12<TTextObjectArgument, TTextObjectArgument>
	| Tuple12<TCheckboxObjectArgument, TTextObjectArgument>
>;
export type ConcatFunctionObject = IFunctionObject<'concat', TTextObjectArgument[]>;
export type JoinFunctionObject = IFunctionObject<'join', TTextObjectArgument[]>;
export type SliceFunctionObject = IFunctionObject<
	'slice',
	[TTextObjectArgument, TNumberObjectArgument, TNumberObjectArgument] | [TTextObjectArgument, TNumberObjectArgument]
>;
export type FormatFunctionObject = IFunctionObject<'format', [TFormulaObjectArgument]>;
export type AndFunctionObject = IFunctionObject<'and', Tuple2<TCheckboxObjectArgument>>;
export type OrFunctionObject = IFunctionObject<'or', Tuple2<TCheckboxObjectArgument>>;
export type LargerFunctionObject = IFunctionObject<'larger', Tuple2<TCheckboxObjectArgument>>;
export type LargerEqFunctionObject = IFunctionObject<'largerEq', Tuple2<TCheckboxObjectArgument>>;
export type SmallerFunctionObject = IFunctionObject<'smaller', Tuple2<TCheckboxObjectArgument>>;
export type SmallerEqFunctionObject = IFunctionObject<'smallerEq', Tuple2<TCheckboxObjectArgument>>;
export type NotFunctionObject = IFunctionObject<'not', [TCheckboxObjectArgument]>;
export type SubtractFunctionObject = IFunctionObject<'subtract', Tuple2<TNumberObjectArgument>>;
export type DivideFunctionObject = IFunctionObject<'divide', Tuple2<TNumberObjectArgument>>;
export type MultiplyFunctionObject = IFunctionObject<'multiply', Tuple2<TNumberObjectArgument>>;
export type PowFunctionObject = IFunctionObject<'pow', Tuple2<TNumberObjectArgument>>;
export type ModFunctionObject = IFunctionObject<'mod', Tuple2<TNumberObjectArgument>>;
export type UnaryMinusFunctionObject = IFunctionObject<'unaryMinus', [TNumberObjectArgument]>;
export type UnaryPlusFunctionObject = IFunctionObject<'unaryPlus', [TNumberObjectArgument]>;
export type ContainsFunctionObject = IFunctionObject<'contains', Tuple2<TTextObjectArgument>>;
export type TestFunctionObject = IFunctionObject<
	'test',
	| [TNumberObjectArgument, TTextObjectArgument]
	| [TTextObjectArgument, TTextObjectArgument]
	| [TCheckboxObjectArgument, TTextObjectArgument]
>;
export type EmptyFunctionObject = IFunctionObject<'empty', [TFormulaObjectArgument]>;
export type AbsFunctionObject = IFunctionObject<'abs', [TNumberObjectArgument]>;
export type CbrtFunctionObject = IFunctionObject<'cbrt', [TNumberObjectArgument]>;
export type CeilFunctionObject = IFunctionObject<'ceil', [TNumberObjectArgument]>;
export type ExpFunctionObject = IFunctionObject<'exp', [TNumberObjectArgument]>;
export type FloorFunctionObject = IFunctionObject<'floor', [TNumberObjectArgument]>;
export type LnFunctionObject = IFunctionObject<'ln', [TNumberObjectArgument]>;
export type Log10FunctionObject = IFunctionObject<'log10', [TNumberObjectArgument]>;
export type Log2FunctionObject = IFunctionObject<'log2', [TNumberObjectArgument]>;
export type MaxFunctionObject = IFunctionObject<'max', TNumberObjectArgument[]>;
export type MinFunctionObject = IFunctionObject<'min', TNumberObjectArgument[]>;
export type RoundFunctionObject = IFunctionObject<'round', [TNumberObjectArgument]>;
export type SignFunctionObject = IFunctionObject<'sign', [TNumberObjectArgument]>;
export type SqrtFunctionObject = IFunctionObject<'sqrt', [TNumberObjectArgument]>;
export type StartFunctionObject = IFunctionObject<'start', [TDateObjectArgument]>;
export type EndFunctionObject = IFunctionObject<'end', [TDateObjectArgument]>;
export type DateAddFunctionObject = IFunctionObject<
	'dateAdd',
	[TDateObjectArgument, TNumberObjectArgument, TDateConstantValueType]
>;
export type DateSubtractFunctionObject = IFunctionObject<
	'dateSubtract',
	[TDateObjectArgument, TNumberObjectArgument, TDateConstantValueType]
>;
export type DateBetweenFunctionObject = IFunctionObject<
	'dateBetween',
	Tuple12<TDateObjectArgument, TDateConstantValueType>
>;
export type FormatDateFunctionObject = IFunctionObject<'formatDate', [TDateObjectArgument, TTextObjectArgument]>;
export type TimestampFunctionObject = IFunctionObject<'timestamp', [TDateObjectArgument]>;
export type FromTimestampFunctionObject = IFunctionObject<'fromTimestamp', [TNumberObjectArgument]>;
export type MinuteFunctionObject = IFunctionObject<'minute', [TDateObjectArgument]>;
export type HourFunctionObject = IFunctionObject<'hour', [TDateObjectArgument]>;
export type DayFunctionObject = IFunctionObject<'day', [TDateObjectArgument]>;
export type DateFunctionObject = IFunctionObject<'date', [TDateObjectArgument]>;
export type MonthFunctionObject = IFunctionObject<'month', [TDateObjectArgument]>;
export type YearFunctionObject = IFunctionObject<'year', [TDateObjectArgument]>;
export type LengthFunctionObject = IFunctionObject<'length', [TTextObjectArgument]>;
export type ToNumberFunctionObject = IFunctionObject<'toNumber', [TFormulaObjectArgument]>;
export type NowFunctionObject = {
	function: 'now';
	args?: [];
};

export type TTextFunctionObject =
	| TextIfFunctionObject
	| TextAddFunctionObject
	| ReplaceAllFunctionObject
	| ReplaceFunctionObject
	| ConcatFunctionObject
	| JoinFunctionObject
	| SliceFunctionObject
	| FormatFunctionObject;

export type TCheckboxFunctionObject =
	| CheckboxIfFunctionObject
	| EqualFunctionObject
	| UnequalFunctionObject
	| AndFunctionObject
	| OrFunctionObject
	| LargerFunctionObject
	| LargerEqFunctionObject
	| SmallerFunctionObject
	| SmallerEqFunctionObject
	| NotFunctionObject
	| EmptyFunctionObject
	| TestFunctionObject
	| ContainsFunctionObject;

export type TNumberFunctionObject =
	| NumberAddFunctionObject
	| SubtractFunctionObject
	| DivideFunctionObject
	| MultiplyFunctionObject
	| PowFunctionObject
	| ModFunctionObject
	| UnaryMinusFunctionObject
	| UnaryPlusFunctionObject
	| NumberIfFunctionObject
	| DateBetweenFunctionObject
	| TimestampFunctionObject
	| SqrtFunctionObject
	| SignFunctionObject
	| RoundFunctionObject
	| MinFunctionObject
	| MaxFunctionObject
	| Log2FunctionObject
	| Log10FunctionObject
	| LnFunctionObject
	| FloorFunctionObject
	| ExpFunctionObject
	| CeilFunctionObject
	| CbrtFunctionObject
	| AbsFunctionObject
	| ToNumberFunctionObject
	| LengthFunctionObject;

export type TDateFunctionObject =
	| DateIfFunctionObject
	| FormatDateFunctionObject
	| DateSubtractFunctionObject
	| DateAddFunctionObject
	| NowFunctionObject
	| StartFunctionObject
	| EndFunctionObject
	| TimestampFunctionObject
	| FromTimestampFunctionObject
	| MinuteFunctionObject
	| HourFunctionObject
	| DayFunctionObject
	| DateFunctionObject
	| MonthFunctionObject
	| YearFunctionObject;

export type TFormulaObject =
	| TDateFunctionObject
	| TTextFunctionObject
	| TNumberFunctionObject
	| TCheckboxFunctionObject;

export type FormulaObjectSchemaUnitInput = {
	type: 'formula';
	name: string;
	formula: TFormulaObject;
};
