import { TFormulaResultType } from '@nishans/types';
import {
	generateCheckboxFunction,
	generateCheckboxProperty,
	generateCheckboxSymbol,
	generateDateFunction,
	generateDateProperty,
	generateNumberConstant,
	generateNumberFunction,
	generateNumberProperty,
	generateNumberSymbol,
	generateProperty,
	generateTextConstant,
	generateTextFunction,
	generateTextProperty
} from './generateFormulaParts';

export function generateFunctionFormulaASTArguments (arg_return_types: TFormulaResultType[]) {
	const arg_types = {
		property: [],
		symbol: [],
		constant: [],
		function: []
	} as any;

	arg_return_types.forEach((arg_return_type) => {
		switch (arg_return_type) {
			case 'number':
				arg_types.property.push(generateNumberProperty('number'));
				arg_types.symbol.push(generateNumberSymbol('e'));
				arg_types.constant.push(generateNumberConstant(1));
				arg_types.function.push(generateNumberFunction('abs', [ generateNumberConstant(1) ]));
				break;
			case 'text':
				arg_types.property.push(generateTextProperty('text'));
				arg_types.constant.push(generateTextConstant('text'));
				arg_types.function.push(
					generateTextFunction('concat', [ generateTextConstant('0'), generateTextConstant('1') ])
				);
				break;
			case 'checkbox':
				arg_types.property.push(generateCheckboxProperty('checkbox'));
				arg_types.symbol.push(generateCheckboxSymbol(true));
				arg_types.function.push(
					generateCheckboxFunction('equal', [ generateTextConstant('0'), generateTextConstant('1') ])
				);
				break;
			case 'date':
				arg_types.property.push(generateDateProperty('date'));
				arg_types.function.push(generateDateFunction('year', [ generateDateFunction('now') ]));
				break;
		}
	});

	return arg_types;
}

export function generateFunctionFormulaArrayArguments (arg_return_types: TFormulaResultType[]) {
	const arg_types = {
		property: [],
		symbol: [],
		constant: [],
		function: []
	} as any;

	arg_return_types.forEach((arg_return_type) => {
		switch (arg_return_type) {
			case 'number':
				arg_types.property.push({ property: 'number' });
				arg_types.symbol.push('e');
				arg_types.constant.push(1);
				arg_types.function.push([ 'abs', [ 1 ] ]);
				break;
			case 'text':
				arg_types.property.push({ property: 'text' });
				arg_types.constant.push('text');
				arg_types.function.push([ 'concat', [ '0', '1' ] ]);
				break;
			case 'checkbox':
				arg_types.property.push({ property: 'checkbox' });
				arg_types.symbol.push(true);
				arg_types.function.push([ 'equal', [ '0', '1' ] ]);
				break;
			case 'date':
				arg_types.property.push({ property: 'date' });
				arg_types.function.push([ 'year', [ 'now' ] ]);
				break;
		}
	});

	return arg_types;
}

export function generateFunctionFormulaObjectArguments (arg_return_types: TFormulaResultType[]) {
	const arg_types = {
		property: [],
		symbol: [],
		constant: [],
		function: []
	} as any;

	arg_return_types.forEach((arg_return_type) => {
		switch (arg_return_type) {
			case 'number':
				arg_types.property.push({ property: 'number' });
				arg_types.symbol.push('e');
				arg_types.constant.push(1);
				arg_types.function.push({
					function: 'abs',
					args: [ 1 ]
				});
				break;
			case 'text':
				arg_types.property.push({ property: 'text' });
				arg_types.constant.push('text');
				arg_types.function.push({ function: 'concat', args: [ '0', '1' ] });
				break;
			case 'checkbox':
				arg_types.property.push({ property: 'checkbox' });
				arg_types.symbol.push(true);
				arg_types.function.push({ function: 'equal', args: [ '0', '1' ] });
				break;
			case 'date':
				arg_types.property.push({ property: 'date' });
				arg_types.function.push({ function: 'year', args: [ { function: 'now' } ] });
				break;
		}
	});

	return arg_types;
}
