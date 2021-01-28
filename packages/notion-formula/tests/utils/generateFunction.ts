import { TFunctionFormula, TFunctionName } from '@nishans/types';

export function generateFunction (name: TFunctionName, result_type: 'number' | 'text' | 'checkbox' | 'date') {
	const formula: TFunctionFormula = {
		type: 'function',
		result_type,
		name,
		args: []
	} as any;

	return {
		arg: (args: any[]) => {
			args.forEach((arg) => (formula.args as any).push(arg));
			return formula;
		},
		formula
	};
}

export function generateNumberFunction (name: TFunctionName) {
	return generateFunction(name, 'number');
}

export function generateCheckboxFunction (name: TFunctionName) {
	return generateFunction(name, 'checkbox');
}

export function generateDateFunction (name: TFunctionName) {
	return generateFunction(name, 'date');
}

export function generateTextFunction (name: TFunctionName) {
	return generateFunction(name, 'text');
}

export function generateNumberConstant (value: number) {
	return {
		type: 'constant',
		result_type: 'number',
		value: value.toString(),
		value_type: 'number'
	};
}
