import { TFunctionFormula, TFunctionName } from '@nishans/types';

export function generateFunction (
	name: TFunctionName,
	result_type: 'number' | 'text' | 'checkbox' | 'date',
	args: any[]
) {
	return {
		type: 'function',
		result_type,
		name,
		args
	} as TFunctionFormula;
}

export function generateNumberFunction (name: TFunctionName, args: any[]) {
	return generateFunction(name, 'number', args);
}

export function generateCheckboxFunction (name: TFunctionName, args: any[]) {
	return generateFunction(name, 'checkbox', args);
}

export function generateDateFunction (name: TFunctionName, args: any[]) {
	return generateFunction(name, 'date', args);
}

export function generateTextFunction (name: TFunctionName, args: any[]) {
	return generateFunction(name, 'text', args);
}

export function generateNumberConstant (value: number) {
	return {
		type: 'constant',
		result_type: 'number',
		value: value.toString(),
		value_type: 'number'
	};
}

export function generateNumberProperty (name: string) {
	return {
		type: 'property',
		id: name,
		name,
		result_type: 'number'
	};
}
