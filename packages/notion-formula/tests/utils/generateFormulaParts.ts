import {
	ICheckboxPropertyFormula,
	IDatePropertyFormula,
	INumberConstantFormula,
	INumberPropertyFormula,
	ITextConstantFormula,
	ITextPropertyFormula,
	TCheckboxFunctionFormula,
	TCheckboxSymbolFormula,
	TDateFunctionFormula,
	TFormulaResultType,
	TFunctionFormula,
	TFunctionName,
	TNumberFunctionFormula,
	TNumberSymbolFormula,
	TPropertyFormula,
	TSymbolFormula,
	TTextFunctionFormula
} from '@nishans/types';

export function generateFunction (
	name: TFunctionName,
	result_type: 'number' | 'text' | 'checkbox' | 'date',
	args?: any[]
) {
	const formula = {
		type: 'function',
		result_type,
		name
	} as TFunctionFormula;
	if (args) (formula as any).args = args;
	return formula;
}

export function generateNumberFunction (name: TFunctionName, args?: any[]) {
	return generateFunction(name, 'number', args) as TNumberFunctionFormula;
}

export function generateTextFunction (name: TFunctionName, args?: any[]) {
	return generateFunction(name, 'text', args) as TTextFunctionFormula;
}

export function generateCheckboxFunction (name: TFunctionName, args?: any[]) {
	return generateFunction(name, 'checkbox', args) as TCheckboxFunctionFormula;
}

export function generateDateFunction (name: TFunctionName, args?: any[]) {
	return generateFunction(name, 'date', args) as TDateFunctionFormula;
}

export function generateTextConstant (value: string): ITextConstantFormula {
	return {
		type: 'constant',
		result_type: 'text',
		value: value.toString(),
		value_type: 'string'
	};
}

export function generateNumberConstant (value: number): INumberConstantFormula {
	return {
		type: 'constant',
		result_type: 'number',
		value: value.toString(),
		value_type: 'number'
	};
}

export function generateProperty (result_type: TFormulaResultType, name: string): TPropertyFormula {
	return {
		type: 'property',
		id: name.toLowerCase(),
		name,
		result_type
	};
}

export function generateNumberProperty (name: string) {
	return generateProperty('number', name) as INumberPropertyFormula;
}

export function generateTextProperty (name: string) {
	return generateProperty('text', name) as ITextPropertyFormula;
}

export function generateCheckboxProperty (name: string) {
	return generateProperty('checkbox', name) as ICheckboxPropertyFormula;
}

export function generateDateProperty (name: string) {
	return generateProperty('date', name) as IDatePropertyFormula;
}

export function generateNumberSymbol (name: 'e' | 'pi'): TNumberSymbolFormula {
	return {
		name,
		result_type: 'number',
		type: 'symbol'
	};
}

export function generateCheckboxSymbol (name: boolean): TCheckboxSymbolFormula {
	return {
		name: name.toString() as any,
		result_type: 'checkbox',
		type: 'symbol'
	};
}
