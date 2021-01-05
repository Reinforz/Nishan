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

export type TCheckboxOperatorFormula =
	| I2ArgCheckboxOperatorFormula<'and'>
	| I2ArgCheckboxOperatorFormula<'or'>
	| I2ArgCheckboxOperatorFormula<'larger'>
	| I2ArgCheckboxOperatorFormula<'largerEq'>
	| I2ArgCheckboxOperatorFormula<'smaller'>
	| I2ArgCheckboxOperatorFormula<'smallerEq'>
	| I1ArgCheckboxOperatorFormula<'not'>;

export type TNumberOperatorFormula =
	| I2ArgNumberOperatorFormula<'subtract'>
	| I2ArgNumberOperatorFormula<'add'>
	| I2ArgNumberOperatorFormula<'divide'>
	| I2ArgNumberOperatorFormula<'multiple'>
	| I2ArgNumberOperatorFormula<'pow'>
	| I2ArgNumberOperatorFormula<'mod'>
	| I1ArgNumberOperatorFormula<'unaryMinus'>
	| I1ArgNumberOperatorFormula<'unaryPlus'>;

export type TOperatorFormula = TCheckboxOperatorFormula | TNumberOperatorFormula;

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

export interface IfFunctionFormula {
	type: 'function';
	result_type: 'text';
	name: 'if';
	args: Tuple3AnyResultType<TCheckboxResultTypeFormula>;
}

export interface EqualFunctionFormula {
	type: 'function';
	result_type: 'checkbox';
	name: 'equal';
	args: Tuple2AnyResultType;
}

export interface UnequalFunctionFormula {
	type: 'function';
	result_type: 'checkbox';
	name: 'unequal';
	args: Tuple2AnyResultType;
}

export interface AddFunctionFormula {
	type: 'function';
	result_type: 'text';
	name: 'add';
	args: Tuple2<TTextResultTypeFormula> | Tuple2<TNumberResultTypeFormula>;
}

export interface IFunctionFormula<
	RT extends TFormulaResultType,
	O extends T1ArgNumberFunctionName | T2ArgNumberFunctionName | T1ArgCheckboxFunctionName | T2ArgCheckboxFunctionName,
	A extends TResultTypeFormula | Tuple2<TResultTypeFormula>
> {
	type: 'function';
	result_type: RT;
	name: O;
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

export type TCheckboxFunctionFormula =
	| I2ArgCheckboxFunctionFormula<'and'>
	| I2ArgCheckboxFunctionFormula<'or'>
	| I2ArgCheckboxFunctionFormula<'larger'>
	| I2ArgCheckboxFunctionFormula<'largerEq'>
	| I2ArgCheckboxFunctionFormula<'smaller'>
	| I2ArgCheckboxFunctionFormula<'smallerEq'>
	| I1ArgCheckboxFunctionFormula<'not'>;

export type TNumberFunctionFormula =
	| I2ArgNumberFunctionFormula<'subtract'>
	| I2ArgNumberFunctionFormula<'add'>
	| I2ArgNumberFunctionFormula<'divide'>
	| I2ArgNumberFunctionFormula<'multiple'>
	| I2ArgNumberFunctionFormula<'pow'>
	| I2ArgNumberFunctionFormula<'mod'>
	| I1ArgNumberFunctionFormula<'unaryMinus'>
	| I1ArgNumberFunctionFormula<'unaryPlus'>;

export type THybridFunctionFormula =
	| IfFunctionFormula
	| EqualFunctionFormula
	| UnequalFunctionFormula
	| TNumberFunctionFormula
	| TCheckboxFunctionFormula;

export type TFormula = TOperatorFormula | TPropertyFormula | TSymbolFormula | THybridFunctionFormula;
