export type TFormulaName = 'if' | 'equal';
export type TFormulaType = 'operator' | 'property' | 'function' | 'symbol' | 'constant';
export type TFormulaResultType = 'number' | 'checkbox' | 'text' | 'date';
export type TFormulaValueType = 'number' | 'string';
export type TFormulaSymbolName = 'false' | 'true';

export type Tuple2<T extends TResultTypeFormula> = [T, T];
export type Tuple3<T1 extends TResultTypeFormula, T2 extends TResultTypeFormula> = [T1, T2, T2];

// Result types

export type TCheckboxResultTypeFormula =
	| IPropertyFormula<'checkbox'>
	| ISymbolFormula<'false', 'checkbox'>
	| ISymbolFormula<'true', 'checkbox'>
	| TOperatorFormula;

export type TTextResultTypeFormula =
	| IPropertyFormula<'text'>
	| IConstantFormula<'text', 'string'>
	| IConstantFormula<'text', 'number'>;
export type TNumberResultTypeFormula = IPropertyFormula<'number'>;
export type TDateResultTypeFormula = IPropertyFormula<'date'>;
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
	| Tuple3<T, TTextResultTypeFormula>
	| Tuple3<T, TCheckboxResultTypeFormula>
	| Tuple3<T, TDateResultTypeFormula>
	| Tuple3<T, TNumberResultTypeFormula>;

// Operators

export type T1ArgNumberOperatorName = T1ArgNumberFunctionName;
export type T2ArgNumberOperatorName = T2ArgNumberFunctionName;
export type T1ArgCheckboxOperatorName = T1ArgCheckboxFunctionName;
export type T2ArgCheckboxOperatorName = T2ArgCheckboxFunctionName;

export interface IfOperatorFormula {
	type: 'operator';
	result_type: 'text';
	name: 'if';
	operator: 'if';
	args: Tuple3AnyResultType<TCheckboxResultTypeFormula>;
}

export interface EqualityOperatorFormula<N extends 'equal' | 'unequal'> {
	type: 'operator';
	result_type: 'checkbox';
	name: N;
	operator: N;
	args: Tuple2AnyResultType;
}

export type EqualOperatorFormula = EqualityOperatorFormula<'equal'>;
export type UnequalOperatorFormula = EqualityOperatorFormula<'unequal'>;

export interface AddOperatorFormula {
	type: 'operator';
	result_type: 'text';
	name: 'add';
	operator: 'add';
	args: Tuple2<TTextResultTypeFormula> | Tuple2<TNumberResultTypeFormula>;
}

export interface IOperatorFormula<
	RT extends TFormulaResultType,
	O extends T1ArgNumberOperatorName | T2ArgNumberOperatorName | T1ArgCheckboxOperatorName | T2ArgCheckboxOperatorName,
	A extends TResultTypeFormula | Tuple2<TResultTypeFormula>
> {
	type: 'operator';
	result_type: RT;
	operator: O;
	name: O;
	args: A;
}

export type I1ArgCheckboxOperatorFormula<O extends T1ArgCheckboxOperatorName> = IOperatorFormula<
	'checkbox',
	O,
	TCheckboxResultTypeFormula
>;
export type I2ArgCheckboxOperatorFormula<O extends T2ArgCheckboxOperatorName> = IOperatorFormula<
	'checkbox',
	O,
	Tuple2<TCheckboxResultTypeFormula>
>;
export type I1ArgNumberOperatorFormula<O extends T1ArgNumberOperatorName> = IOperatorFormula<
	'number',
	O,
	TNumberResultTypeFormula
>;
export type I2ArgNumberOperatorFormula<O extends T2ArgNumberOperatorName> = IOperatorFormula<
	'number',
	O,
	Tuple2<TNumberResultTypeFormula>
>;

export type AndOperatorFormula = I2ArgCheckboxOperatorFormula<'and'>;
export type OrOperatorFormula = I2ArgCheckboxOperatorFormula<'or'>;
export type LargerOperatorFormula = I2ArgCheckboxOperatorFormula<'larger'>;
export type LargerEqOperatorFormula = I2ArgCheckboxOperatorFormula<'largerEq'>;
export type SmallerOperatorFormula = I2ArgCheckboxOperatorFormula<'smaller'>;
export type SmallerEqOperatorFormula = I2ArgCheckboxOperatorFormula<'smallerEq'>;
export type NotOperatorFormula = I1ArgCheckboxOperatorFormula<'not'>;

export type SsubtractOperatorFormula = I2ArgNumberOperatorFormula<'subtract'>;
export type DivideOperatorFormula = I2ArgNumberOperatorFormula<'divide'>;
export type MultipleOperatorFormula = I2ArgNumberOperatorFormula<'multiple'>;
export type PowOperatorFormula = I2ArgNumberOperatorFormula<'pow'>;
export type ModOperatorFormula = I2ArgNumberOperatorFormula<'mod'>;
export type UnaryMinusOperatorFormula = I1ArgNumberOperatorFormula<'unaryMinus'>;
export type UnaryPlusOperatorFormula = I1ArgNumberOperatorFormula<'unaryPlus'>;

export type TCheckboxOperatorFormula =
	| AndOperatorFormula
	| OrOperatorFormula
	| LargerOperatorFormula
	| LargerEqOperatorFormula
	| SmallerOperatorFormula
	| SmallerEqOperatorFormula
	| NotOperatorFormula;

export type TNumberOperatorFormula =
	| SsubtractOperatorFormula
	| DivideOperatorFormula
	| MultipleOperatorFormula
	| PowOperatorFormula
	| ModOperatorFormula
	| UnaryMinusOperatorFormula
	| UnaryPlusOperatorFormula;

export type TOperatorFormula =
	| IfOperatorFormula
	| AddOperatorFormula
	| EqualOperatorFormula
	| UnequalOperatorFormula
	| TCheckboxOperatorFormula
	| TNumberOperatorFormula;

// Constants

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

export type TSymbolFormula =
	| ISymbolFormula<'e', 'number'>
	| ISymbolFormula<'pi', 'number'>
	| ISymbolFormula<'true', 'checkbox'>
	| ISymbolFormula<'false', 'checkbox'>;

export interface IPropertyFormula<RT extends TFormulaResultType> {
	type: 'property';
	id: string;
	name: string;
	result_type: RT;
}

export type TPropertyFormula =
	| IPropertyFormula<'checkbox'>
	| IPropertyFormula<'text'>
	| IPropertyFormula<'date'>
	| IPropertyFormula<'number'>;

export interface IConstantFormula<RT extends TFormulaResultType, VT extends TFormulaValueType> {
	type: 'constant';
	result_type: RT;
	value_type: VT;
	value: string;
}

export type TConstantFormula = IConstantFormula<'text', 'string'> | IConstantFormula<'text', 'number'>;

// Hybrid Functions

export type T1ArgNumberFunctionName = 'unaryMinus' | 'unaryPlus';
export type T2ArgNumberFunctionName = 'add' | 'subtract' | 'multiple' | 'divide' | 'pow' | 'mod';
export type T1ArgCheckboxFunctionName = 'not';
export type T2ArgCheckboxFunctionName = 'and' | 'or' | 'larger' | 'largerEq' | 'smaller' | 'smallerEq';
export type T2ArgTextFunctionName = 'concat';

export interface IfFunctionFormula {
	type: 'function';
	result_type: 'text';
	name: 'if';
	args: Tuple3AnyResultType<TCheckboxResultTypeFormula>;
}

export interface EqualityFunctionFormula<N extends 'equal' | 'unequal'> {
	type: 'function';
	result_type: 'checkbox';
	name: N;
	args: Tuple2AnyResultType;
}

export type EqualFunctionFormula = EqualityFunctionFormula<'equal'>;
export type UnequalFunctionFormula = EqualityFunctionFormula<'unequal'>;

export interface AddFunctionFormula {
	type: 'function';
	result_type: 'text';
	name: 'add';
	args: Tuple2<TTextResultTypeFormula> | Tuple2<TNumberResultTypeFormula>;
}

export type TFunctionFormulaType =
	| T1ArgNumberFunctionName
	| T2ArgNumberFunctionName
	| T1ArgCheckboxFunctionName
	| T2ArgCheckboxFunctionName
	| T2ArgTextFunctionName;
export interface IFunctionFormula<
	RT extends TFormulaResultType,
	N extends TFunctionFormulaType,
	A extends TResultTypeFormula | Tuple2<TResultTypeFormula>
> {
	type: 'function';
	result_type: RT;
	name: N;
	args: A;
}

export type I1ArgCheckboxFunctionFormula<O extends T1ArgCheckboxFunctionName> = IFunctionFormula<
	'checkbox',
	O,
	TCheckboxResultTypeFormula
>;
export type I2ArgCheckboxFunctionFormula<O extends T2ArgCheckboxFunctionName> = IFunctionFormula<
	'checkbox',
	O,
	Tuple2<TCheckboxResultTypeFormula>
>;
export type I1ArgNumberFunctionFormula<O extends T1ArgNumberFunctionName> = IFunctionFormula<
	'number',
	O,
	TNumberResultTypeFormula
>;
export type I2ArgNumberFunctionFormula<O extends T2ArgNumberFunctionName> = IFunctionFormula<
	'number',
	O,
	Tuple2<TNumberResultTypeFormula>
>;

export type AndFunctionFormula = I2ArgCheckboxFunctionFormula<'and'>;
export type OrFunctionFormula = I2ArgCheckboxFunctionFormula<'or'>;
export type LargerFunctionFormula = I2ArgCheckboxFunctionFormula<'larger'>;
export type LargerEqFunctionFormula = I2ArgCheckboxFunctionFormula<'largerEq'>;
export type SmallerFunctionFormula = I2ArgCheckboxFunctionFormula<'smaller'>;
export type SmallerEqFunctionFormula = I2ArgCheckboxFunctionFormula<'smallerEq'>;
export type NotFunctionFormula = I1ArgCheckboxFunctionFormula<'not'>;

export type SubtractFunctionFormula = I2ArgNumberFunctionFormula<'subtract'>;
export type DivideFunctionFormula = I2ArgNumberFunctionFormula<'divide'>;
export type MultipleFunctionFormula = I2ArgNumberFunctionFormula<'multiple'>;
export type PowFunctionFormula = I2ArgNumberFunctionFormula<'pow'>;
export type ModFunctionFormula = I2ArgNumberFunctionFormula<'mod'>;
export type UnaryMinusFunctionFormula = I1ArgNumberFunctionFormula<'unaryMinus'>;
export type UnaryPlusFunctionFormula = I1ArgNumberFunctionFormula<'unaryPlus'>;

export type TCheckboxFunctionFormula =
	| AndFunctionFormula
	| OrFunctionFormula
	| LargerFunctionFormula
	| LargerEqFunctionFormula
	| SmallerFunctionFormula
	| SmallerEqFunctionFormula
	| NotFunctionFormula;

export type TNumberFunctionFormula =
	| SubtractFunctionFormula
	| DivideFunctionFormula
	| MultipleFunctionFormula
	| PowFunctionFormula
	| ModFunctionFormula
	| UnaryMinusFunctionFormula
	| UnaryPlusFunctionFormula;

export type THybridFunctionFormula =
	| IfFunctionFormula
	| EqualFunctionFormula
	| UnequalFunctionFormula
	| TNumberFunctionFormula
	| TCheckboxFunctionFormula;

// Functions

export type TFunctionFormula = '';

export type TFormula = TFunctionFormula | TOperatorFormula | TPropertyFormula | TSymbolFormula | THybridFunctionFormula;
