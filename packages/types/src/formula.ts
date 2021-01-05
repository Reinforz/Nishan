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

export interface I1ArgCheckboxOperatorFormula<O extends T1ArgCheckboxOperatorName> {
	type: 'operator';
	result_type: 'checkbox';
	operator: O;
	name: O;
	args: [TCheckboxResultTypeFormula];
}

export type TOperatorFormula = I1ArgCheckboxOperatorFormula<'not'>;

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

// Functions

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

export interface I1ArgNumberFunctionFormula<N extends T1ArgNumberFunctionName> {
	type: 'function';
	result_type: 'number';
	name: N;
	args: [TNumberResultTypeFormula];
}
export interface I2ArgNumberFunctionFormula<N extends T2ArgNumberFunctionName> {
	type: 'function';
	result_type: 'number';
	name: N;
	args: Tuple2<TNumberResultTypeFormula>;
}

export interface I1ArgCheckboxFunctionFormula<N extends T1ArgCheckboxFunctionName> {
	type: 'function';
	result_type: 'checkbox';
	name: N;
	args: [TCheckboxResultTypeFormula];
}

export interface I2ArgCheckboxFunctionFormula<N extends T2ArgCheckboxFunctionName> {
	type: 'function';
	result_type: 'checkbox';
	name: N;
	args: Tuple2<TCheckboxResultTypeFormula>;
}

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

export type TFunctionFormula =
	| IfFunctionFormula
	| EqualFunctionFormula
	| UnequalFunctionFormula
	| TNumberFunctionFormula
	| TCheckboxFunctionFormula;

export type TFormula = TOperatorFormula | TPropertyFormula | TSymbolFormula | TFunctionFormula;
