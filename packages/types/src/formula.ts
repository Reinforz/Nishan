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

export type TFormula = TOperatorFormula | TPropertyFormula;
