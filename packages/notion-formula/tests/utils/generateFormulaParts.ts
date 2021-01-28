import { TFormulaResultType, TFunctionFormula, TFunctionName } from '@nishans/types';

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
	if (args) formula.args = args;
	return formula;
}

export function generateNumberFunction (name: TFunctionName, args?: any[]) {
	return generateFunction(name, 'number', args);
}

export function generateTextFunction (name: TFunctionName, args?: any[]) {
	return generateFunction(name, 'text', args);
}

export function generateCheckboxFunction (name: TFunctionName, args?: any[]) {
	return generateFunction(name, 'checkbox', args);
}

export function generateDateFunction (name: TFunctionName, args?: any[]) {
	return generateFunction(name, 'date', args);
}

export function generateTextConstant (value: string) {
	return {
		type: 'constant',
		result_type: 'text',
		value: value.toString(),
		value_type: 'string'
	};
}

export function generateNumberConstant (value: number) {
	return {
		type: 'constant',
		result_type: 'number',
		value: value.toString(),
		value_type: 'number'
	};
}

export function generateProperty (result_type: TFormulaResultType, name: string) {
	return {
		type: 'property',
		id: name.toLowerCase(),
		name,
		result_type
	};
}

export function generateNumberProperty (name: string) {
	return generateProperty('number', name);
}

export function generateTextProperty (name: string) {
	return generateProperty('text', name);
}

export function generateCheckboxProperty (name: string) {
	return generateProperty('checkbox', name);
}

export function generateDateProperty (name: string) {
	return generateProperty('date', name);
}

export function generateNumberSymbol (name: 'e' | 'pi') {
	return {
		name,
		result_type: 'number',
		type: 'symbol'
	};
}

export function generateCheckboxSymbol (name: boolean) {
	return {
		name: name.toString(),
		result_type: 'checkbox',
		type: 'symbol'
	};
}
