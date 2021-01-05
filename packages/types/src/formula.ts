export type TFormulaName = 'if' | 'equal';
export type TFormulaType = 'operator' | 'property' | 'function' | 'symbol' | 'constant';
export type TFormulaResultType = 'number' | 'checkbox' | 'text' | 'date';
export type TFormulaValueType = 'number' | 'string';
export type TFormulaSymbolName = 'false' | 'true';

export interface IFormulaArgsPropertyType {
	type: 'property';
	id: string;
	result_type: TFormulaResultType;
	name: string;
}

export interface IFormulaArgsConstantType {
	type: 'constant';
	result_type: TFormulaResultType;
	value: string;
	value_type: TFormulaValueType;
}

export type TFormulaArgs = IFormulaArgsPropertyType | IFormulaArgsConstantType;

export interface IFormulaArgsPropertyType {
	type: 'property';
	id: string;
}

export interface ISymbolCheckboxFormula {
	name: TFormulaSymbolName;
	result_type: 'checkbox';
	type: 'symbol';
}

export type TCheckboxFormula = ISymbolCheckboxFormula | IPropertyFormula<'checkbox'>;

export type TOperatorFormula = IEqualOperatorFormula;

export interface IEqualOperatorFormula {
	name: 'equal';
	type: 'operator';
	operator: '==';
	result_type: 'checkbox';
	args: [TCheckboxFormula, TCheckboxFormula];
}

export type TCheckboxResultTypeFormula =
	| IPropertyFormula<'checkbox'>
	| ISymbolFormula<'false', 'checkbox'>
	| ISymbolFormula<'true', 'checkbox'>;
export type TTextResultTypeFormula =
	| IPropertyFormula<'text'>
	| IConstantFormula<'text', 'string'>
	| IConstantFormula<'text', 'number'>;
export type TNumberResultTypeFormula = IPropertyFormula<'number'>;
export type TDateResultTypeFormula = IPropertyFormula<'date'>;

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
export interface IfFunctionFormula {
	type: 'function';
	result_type: 'text';
	name: 'if';
	args:
		| [TCheckboxResultTypeFormula, TTextResultTypeFormula, TTextResultTypeFormula]
		| [TCheckboxResultTypeFormula, TCheckboxResultTypeFormula, TCheckboxResultTypeFormula]
		| [TCheckboxResultTypeFormula, TDateResultTypeFormula, TDateResultTypeFormula]
		| [TCheckboxResultTypeFormula, TNumberResultTypeFormula, TNumberResultTypeFormula];
}

export type TFunctionFormula = IfFunctionFormula;

export type TFormula = TOperatorFormula | TPropertyFormula | TSymbolFormula | TFunctionFormula;
