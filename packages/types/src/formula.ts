export type TFormulaType = 'operator' | 'property' | 'function' | 'symbol' | 'constant';
export type TFormulaResultType = 'number' | 'checkbox' | 'text' | 'date';
export type TConstantFormulaValueType = 'number' | 'string';
export type TFormulaSymbolName = 'false' | 'true' | 'pi' | 'e';

export type Tuple2<T extends any> = [T, T];
export type Tuple12<T1 extends any, T2 extends any> = [T1, T2, T2];
export type Tuple3<T extends any> = [T, T, T];

// Result types

export type TCheckboxResultTypeFormula =
	| ICheckboxPropertyFormula
	| TCheckboxSymbolFormula
	| TCheckboxOperatorFormula
	| TCheckboxFunctionFormula;

export type TTextResultTypeFormula =
	| ITextPropertyFormula
	| ITextConstantFormula
	| TTextOperatorFormula
	| TTextFunctionFormula;

export type TNumberResultTypeFormula =
	| INumberPropertyFormula
	| TNumberSymbolFormula
	| INumberConstantFormula
	| TNumberOperatorFormula
	| TNumberFunctionFormula;

export type TDateResultTypeFormula = IDatePropertyFormula | TDateFunctionFormula;

export type TResultTypeFormula =
	| TCheckboxResultTypeFormula
	| TTextResultTypeFormula
	| TNumberResultTypeFormula
	| TDateResultTypeFormula;

export type Tuple2AnyResultType =
	| Tuple2<TTextResultTypeFormula>
	| Tuple2<TCheckboxResultTypeFormula>
	| Tuple2<TDateResultTypeFormula>
	| Tuple2<TNumberResultTypeFormula>;

export type Tuple3AnyResultType<T extends TResultTypeFormula> =
	| Tuple12<T, TTextResultTypeFormula>
	| Tuple12<T, TCheckboxResultTypeFormula>
	| Tuple12<T, TDateResultTypeFormula>
	| Tuple12<T, TNumberResultTypeFormula>;

// Properties

export interface IPropertyFormula<RT extends TFormulaResultType> {
	type: 'property';
	id: string;
	name: string;
	result_type: RT;
}

export type TPropertyFormula =
	| ICheckboxPropertyFormula
	| ITextPropertyFormula
	| IDatePropertyFormula
	| INumberPropertyFormula;

export type ICheckboxPropertyFormula = IPropertyFormula<'checkbox'>;
export type ITextPropertyFormula = IPropertyFormula<'text'>;
export type IDatePropertyFormula = IPropertyFormula<'date'>;
export type INumberPropertyFormula = IPropertyFormula<'number'>;

// Operators

export type TOperatorName = THybridFunctionName;
export interface IOperatorFormula<RT extends TFormulaResultType, O extends TOperatorName, A extends any> {
	type: 'operator';
	result_type: RT;
	operator: O;
	name: O;
	args: A;
}

export type EqualOperatorFormula = IOperatorFormula<'checkbox', 'equal', Tuple2AnyResultType>;
export type UnequalOperatorFormula = IOperatorFormula<'checkbox', 'unequal', Tuple2AnyResultType>;
export type AndOperatorFormula = IOperatorFormula<'checkbox', 'and', Tuple2<TCheckboxResultTypeFormula>>;
export type OrOperatorFormula = IOperatorFormula<'checkbox', 'or', Tuple2<TCheckboxResultTypeFormula>>;
export type LargerOperatorFormula = IOperatorFormula<'checkbox', 'larger', Tuple2<TCheckboxResultTypeFormula>>;
export type LargerEqOperatorFormula = IOperatorFormula<'checkbox', 'largerEq', Tuple2<TCheckboxResultTypeFormula>>;
export type SmallerOperatorFormula = IOperatorFormula<'checkbox', 'smaller', Tuple2<TCheckboxResultTypeFormula>>;
export type SmallerEqOperatorFormula = IOperatorFormula<'checkbox', 'smallerEq', Tuple2<TCheckboxResultTypeFormula>>;
export type NotOperatorFormula = IOperatorFormula<'checkbox', 'not', [TCheckboxResultTypeFormula]>;

export type SubtractOperatorFormula = IOperatorFormula<'number', 'subtract', Tuple2<TNumberResultTypeFormula>>;
export type DivideOperatorFormula = IOperatorFormula<'number', 'divide', Tuple2<TNumberResultTypeFormula>>;
export type MultiplyOperatorFormula = IOperatorFormula<'number', 'multiply', Tuple2<TNumberResultTypeFormula>>;
export type PowOperatorFormula = IOperatorFormula<'number', 'pow', Tuple2<TNumberResultTypeFormula>>;
export type ModOperatorFormula = IOperatorFormula<'number', 'mod', Tuple2<TNumberResultTypeFormula>>;
export type UnaryMinusOperatorFormula = IOperatorFormula<'number', 'unaryMinus', [TNumberResultTypeFormula]>;
export type UnaryPlusOperatorFormula = IOperatorFormula<'number', 'unaryPlus', [TNumberResultTypeFormula]>;

export type TextAddOperatorFormula = IOperatorFormula<'text', 'add', Tuple2<TTextResultTypeFormula>>;

export type NumberAddOperatorFormula = IOperatorFormula<'number', 'add', Tuple2<TNumberResultTypeFormula>>;

export type IfOperatorFormula = IOperatorFormula<'text', 'if', Tuple3AnyResultType<TCheckboxResultTypeFormula>>;

export type TTextOperatorFormula = TextAddOperatorFormula | IfOperatorFormula;

export type TCheckboxOperatorFormula =
	| AndOperatorFormula
	| OrOperatorFormula
	| EqualOperatorFormula
	| UnequalOperatorFormula
	| LargerOperatorFormula
	| LargerEqOperatorFormula
	| SmallerOperatorFormula
	| SmallerEqOperatorFormula
	| NotOperatorFormula;

export type TNumberOperatorFormula =
	| NumberAddOperatorFormula
	| SubtractOperatorFormula
	| DivideOperatorFormula
	| MultiplyOperatorFormula
	| PowOperatorFormula
	| ModOperatorFormula
	| UnaryMinusOperatorFormula
	| UnaryPlusOperatorFormula;

export type TOperatorFormula = TTextOperatorFormula | TCheckboxOperatorFormula | TNumberOperatorFormula;

// Symbols

export interface ISymbolCheckboxFormula {
	name: TFormulaSymbolName;
	result_type: 'checkbox';
	type: 'symbol';
}

export type TSymbolFormulaName = 'e' | 'pi' | 'true' | 'false';
export type TSymbolResultType = 'number' | 'checkbox';
export interface ISymbolFormula<N extends TSymbolFormulaName, RT extends TSymbolResultType> {
	type: 'symbol';
	result_type: RT;
	name: N;
}

export type TCheckboxSymbolFormula = ISymbolFormula<'true', 'checkbox'> | ISymbolFormula<'false', 'checkbox'>;

export type TNumberSymbolFormula = ISymbolFormula<'e', 'number'> | ISymbolFormula<'pi', 'number'>;
export type TSymbolFormula = TNumberSymbolFormula | TCheckboxSymbolFormula;

// Constants
export interface IConstantFormula<RT extends TFormulaResultType, VT extends TConstantFormulaValueType, V = string> {
	type: 'constant';
	result_type: RT;
	value_type: VT;
	value: V;
}

export type INumberConstantFormula<V = string> = IConstantFormula<'number', 'number', V>;
export type ITextConstantFormula<V = string> = IConstantFormula<'text', 'string', V>;

export type TConstantFormula = INumberConstantFormula | ITextConstantFormula;

// Hybrid Functions

export type TFunctionName = THybridFunctionName | TPureFunctionName;

export type THybridFunctionName =
	| 'unaryMinus'
	| 'unaryPlus'
	| 'add'
	| 'subtract'
	| 'multiply'
	| 'divide'
	| 'pow'
	| 'mod'
	| 'and'
	| 'or'
	| 'larger'
	| 'largerEq'
	| 'smaller'
	| 'smallerEq'
	| 'not'
	| 'length'
	| 'format'
	| 'equal'
	| 'unequal'
	| 'if';

export interface IFunctionFormula<RT extends TFormulaResultType, N extends TFunctionName, A extends any> {
	type: 'function';
	result_type: RT;
	name: N;
	args: A;
}

export type EqualFunctionFormula = IFunctionFormula<'checkbox', 'equal', Tuple2AnyResultType>;
export type UnequalFunctionFormula = IFunctionFormula<'checkbox', 'unequal', Tuple2AnyResultType>;

export type AndFunctionFormula = IFunctionFormula<'checkbox', 'and', Tuple2<TCheckboxResultTypeFormula>>;
export type OrFunctionFormula = IFunctionFormula<'checkbox', 'or', Tuple2<TCheckboxResultTypeFormula>>;
export type LargerFunctionFormula = IFunctionFormula<'checkbox', 'larger', Tuple2<TCheckboxResultTypeFormula>>;
export type LargerEqFunctionFormula = IFunctionFormula<'checkbox', 'largerEq', Tuple2<TCheckboxResultTypeFormula>>;
export type SmallerFunctionFormula = IFunctionFormula<'checkbox', 'smaller', Tuple2<TCheckboxResultTypeFormula>>;
export type SmallerEqFunctionFormula = IFunctionFormula<'checkbox', 'smallerEq', Tuple2<TCheckboxResultTypeFormula>>;
export type NotFunctionFormula = IFunctionFormula<'checkbox', 'not', [TCheckboxResultTypeFormula]>;

export type SubtractFunctionFormula = IFunctionFormula<'number', 'subtract', Tuple2<TNumberResultTypeFormula>>;
export type DivideFunctionFormula = IFunctionFormula<'number', 'divide', Tuple2<TNumberResultTypeFormula>>;
export type MultiplyFunctionFormula = IFunctionFormula<'number', 'multiply', Tuple2<TNumberResultTypeFormula>>;
export type PowFunctionFormula = IFunctionFormula<'number', 'pow', Tuple2<TNumberResultTypeFormula>>;
export type ModFunctionFormula = IFunctionFormula<'number', 'mod', Tuple2<TNumberResultTypeFormula>>;
export type UnaryMinusFunctionFormula = IFunctionFormula<'number', 'unaryMinus', [TNumberResultTypeFormula]>;
export type UnaryPlusFunctionFormula = IFunctionFormula<'number', 'unaryPlus', [TNumberResultTypeFormula]>;

export type NumberAddFunctionFormula = IFunctionFormula<'number', 'add', Tuple2<TNumberResultTypeFormula>>;

export type TextAddFunctionFormula = IFunctionFormula<'text', 'add', Tuple2<TTextResultTypeFormula>>;

export type NumberIfFunctionFormula = IFunctionFormula<
	'number',
	'if',
	Tuple12<TCheckboxResultTypeFormula, TNumberResultTypeFormula>
>;

export type TextIfFunctionFormula = IFunctionFormula<
	'text',
	'if',
	Tuple12<TCheckboxResultTypeFormula, TTextResultTypeFormula>
>;

export type DateIfFunctionFormula = IFunctionFormula<
	'date',
	'if',
	Tuple12<TCheckboxResultTypeFormula, TDateResultTypeFormula>
>;

export type CheckboxIfFunctionFormula = IFunctionFormula<
	'checkbox',
	'if',
	Tuple12<TCheckboxResultTypeFormula, TCheckboxResultTypeFormula>
>;

export type TTextHybridFunctionFormula = TextIfFunctionFormula | TextAddFunctionFormula;

export type TCheckboxHybridFunctionFormula =
	| EqualFunctionFormula
	| UnequalFunctionFormula
	| AndFunctionFormula
	| OrFunctionFormula
	| LargerFunctionFormula
	| LargerEqFunctionFormula
	| SmallerFunctionFormula
	| SmallerEqFunctionFormula
	| NotFunctionFormula
	| CheckboxIfFunctionFormula;

export type TNumberHybridFunctionFormula =
	| NumberAddFunctionFormula
	| SubtractFunctionFormula
	| DivideFunctionFormula
	| MultiplyFunctionFormula
	| PowFunctionFormula
	| ModFunctionFormula
	| UnaryMinusFunctionFormula
	| UnaryPlusFunctionFormula
	| NumberIfFunctionFormula;

export type TDateHybridFunctionFormula = DateIfFunctionFormula;

export type THybridFunctionFormula =
	| TTextHybridFunctionFormula
	| TNumberHybridFunctionFormula
	| TCheckboxHybridFunctionFormula
	| TDateHybridFunctionFormula;

// Functions

export type TPureFunctionName =
	| 'concat'
	| 'join'
	| 'slice'
	| 'toNumber'
	| 'contains'
	| 'replace'
	| 'replaceAll'
	| 'test'
	| 'empty'
	| 'abs'
	| 'cbrt'
	| 'ceil'
	| 'exp'
	| 'floor'
	| 'ln'
	| 'log10'
	| 'log2'
	| 'min'
	| 'max'
	| 'round'
	| 'sign'
	| 'sqrt'
	| 'start'
	| 'end'
	| 'now'
	| 'timestamp'
	| 'fromTimestamp'
	| 'dateAdd'
	| 'dateSubtract'
	| 'dateBetween'
	| 'formatDate'
	| 'minute'
	| 'hour'
	| 'day'
	| 'date'
	| 'month'
	| 'year';

export type ConcatFunctionFormula = IFunctionFormula<'text', 'concat', Tuple2<TTextResultTypeFormula>>;
export type JoinFunctionFormula = IFunctionFormula<'text', 'join', Array<IConstantFormula<'text', 'string'>>>;
export type SliceFunctionFormula = IFunctionFormula<
	'text',
	'slice',
	Tuple12<ITextConstantFormula, INumberConstantFormula>
>;
export type LengthFunctionFormula = IFunctionFormula<'number', 'length', [ITextConstantFormula]>;
export type FormatFunctionFormula = IFunctionFormula<'text', 'format', [TResultTypeFormula]>;
export type ToNumberFunctionFormula = IFunctionFormula<'number', 'toNumber', [TResultTypeFormula]>;
export type ContainsFunctionFormula = IFunctionFormula<'checkbox', 'contains', Tuple2<TTextResultTypeFormula>>;
export type ReplaceFunctionFormula = IFunctionFormula<
	'text',
	'replace',
	| Tuple12<TNumberResultTypeFormula, TTextResultTypeFormula>
	| Tuple12<TTextResultTypeFormula, TTextResultTypeFormula>
	| Tuple12<TCheckboxResultTypeFormula, TTextResultTypeFormula>
>;
export type ReplaceAllFunctionFormula = IFunctionFormula<
	'text',
	'replaceAll',
	| Tuple12<TNumberResultTypeFormula, TTextResultTypeFormula>
	| Tuple12<TTextResultTypeFormula, TTextResultTypeFormula>
	| Tuple12<TCheckboxResultTypeFormula, TTextResultTypeFormula>
>;

export type TestFunctionFormula = IFunctionFormula<
	'checkbox',
	'test',
	| [TNumberResultTypeFormula, TTextResultTypeFormula]
	| [TTextResultTypeFormula, TTextResultTypeFormula]
	| [TCheckboxResultTypeFormula, TTextResultTypeFormula]
>;
export type EmptyFunctionFormula = IFunctionFormula<
	'checkbox',
	'empty',
	[TNumberResultTypeFormula] | [TTextResultTypeFormula] | [TDateResultTypeFormula] | [TCheckboxResultTypeFormula]
>;
export type AbsFunctionFormula = IFunctionFormula<'number', 'abs', [TNumberResultTypeFormula]>;
export type CbrtFunctionFormula = IFunctionFormula<'number', 'cbrt', [TNumberResultTypeFormula]>;
export type CeilFunctionFormula = IFunctionFormula<'number', 'ceil', [TNumberResultTypeFormula]>;
export type ExpFunctionFormula = IFunctionFormula<'number', 'exp', [TNumberResultTypeFormula]>;
export type FloorFunctionFormula = IFunctionFormula<'number', 'floor', [TNumberResultTypeFormula]>;
export type LnFunctionFormula = IFunctionFormula<'number', 'ln', [TNumberResultTypeFormula]>;
export type Log10FunctionFormula = IFunctionFormula<'number', 'log10', [TNumberResultTypeFormula]>;
export type Log2FunctionFormula = IFunctionFormula<'number', 'log2', [TNumberResultTypeFormula]>;
export type MaxFunctionFormula = IFunctionFormula<'number', 'max', [TNumberResultTypeFormula]>;
export type MinFunctionFormula = IFunctionFormula<'number', 'min', [TNumberResultTypeFormula]>;
export type RoundFunctionFormula = IFunctionFormula<'number', 'round', [TNumberResultTypeFormula]>;
export type SignFunctionFormula = IFunctionFormula<'number', 'sign', [TNumberResultTypeFormula]>;
export type SqrtFunctionFormula = IFunctionFormula<'number', 'sqrt', [TNumberResultTypeFormula]>;
export type StartFunctionFormula = IFunctionFormula<'date', 'start', [TDateResultTypeFormula]>;
export type EndFunctionFormula = IFunctionFormula<'date', 'end', [TDateResultTypeFormula]>;
export type NowFunctionFormula = {
	type: 'function';
	result_type: 'date';
	name: 'now';
	args: [];
};
export type TimestampFunctionFormula = IFunctionFormula<'number', 'timestamp', [TDateResultTypeFormula]>;
export type FromTimestampFunctionFormula = IFunctionFormula<'date', 'fromTimestamp', [TNumberResultTypeFormula]>;
export type MinuteFunctionFormula = IFunctionFormula<'number', 'minute', [TDateResultTypeFormula]>;
export type HourFunctionFormula = IFunctionFormula<'number', 'hour', [TDateResultTypeFormula]>;
export type DayFunctionFormula = IFunctionFormula<'number', 'day', [TDateResultTypeFormula]>;
export type DateFunctionFormula = IFunctionFormula<'number', 'date', [TDateResultTypeFormula]>;
export type MonthFunctionFormula = IFunctionFormula<'number', 'month', [TDateResultTypeFormula]>;
export type YearFunctionFormula = IFunctionFormula<'number', 'year', [TDateResultTypeFormula]>;
export type TDateConstantValueType =
	| 'years'
	| 'quarters'
	| 'months'
	| 'weeks'
	| 'days'
	| 'hours'
	| 'minutes'
	| 'seconds'
	| 'milliseconds';
export type DateAddFunctionFormula = IFunctionFormula<
	'date',
	'dateAdd',
	[TDateResultTypeFormula, TNumberResultTypeFormula, ITextConstantFormula<TDateConstantValueType>]
>;
export type DateSubtractFunctionFormula = IFunctionFormula<
	'date',
	'dateSubtract',
	[TDateResultTypeFormula, TNumberResultTypeFormula, ITextConstantFormula<TDateConstantValueType>]
>;
export type DateBetweenFunctionFormula = IFunctionFormula<
	'number',
	'dateBetween',
	[TDateResultTypeFormula, TDateResultTypeFormula, ITextConstantFormula<TDateConstantValueType>]
>;
export type FormatDateFunctionFormula = IFunctionFormula<
	'date',
	'formatDate',
	[TDateResultTypeFormula, ITextConstantFormula]
>;

export type TTextPureFunctionFormula =
	| ReplaceAllFunctionFormula
	| ReplaceFunctionFormula
	| ConcatFunctionFormula
	| JoinFunctionFormula
	| SliceFunctionFormula
	| FormatFunctionFormula;

export type TNumberPureFunctionFormula =
	| DateBetweenFunctionFormula
	| TimestampFunctionFormula
	| SqrtFunctionFormula
	| SignFunctionFormula
	| RoundFunctionFormula
	| MinFunctionFormula
	| MaxFunctionFormula
	| Log2FunctionFormula
	| Log10FunctionFormula
	| LnFunctionFormula
	| FloorFunctionFormula
	| ExpFunctionFormula
	| CeilFunctionFormula
	| CbrtFunctionFormula
	| AbsFunctionFormula
	| ToNumberFunctionFormula
	| LengthFunctionFormula;
export type TCheckboxPureFunctionFormula = EmptyFunctionFormula | TestFunctionFormula | ContainsFunctionFormula;
export type TDatePureFunctionFormula =
	| FormatDateFunctionFormula
	| DateSubtractFunctionFormula
	| DateAddFunctionFormula
	| NowFunctionFormula
	| StartFunctionFormula
	| EndFunctionFormula
	| TimestampFunctionFormula
	| FromTimestampFunctionFormula
	| MinuteFunctionFormula
	| HourFunctionFormula
	| DayFunctionFormula
	| DateFunctionFormula
	| MonthFunctionFormula
	| YearFunctionFormula;

export type TPureFunctionFormula =
	| TTextPureFunctionFormula
	| TNumberPureFunctionFormula
	| TDatePureFunctionFormula
	| TCheckboxPureFunctionFormula;

export type TNumberFunctionFormula = TNumberHybridFunctionFormula | TNumberPureFunctionFormula;
export type TTextFunctionFormula = TTextHybridFunctionFormula | TTextPureFunctionFormula;
export type TCheckboxFunctionFormula = TCheckboxHybridFunctionFormula | TCheckboxPureFunctionFormula;
export type TDateFunctionFormula = TDateHybridFunctionFormula | TDatePureFunctionFormula;

export type TFunctionFormula = TPureFunctionFormula | THybridFunctionFormula;

export type TFormula = TConstantFormula | TFunctionFormula | TOperatorFormula | TPropertyFormula | TSymbolFormula;
