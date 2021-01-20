import { TFunctionName } from '@nishans/types';

function parseArg (arg: string) {
	if (arg.match(/(true|false)/)) {
		return {
			type: 'symbol',
			name: arg,
			result_type: 'checkbox'
		};
	} else if (arg.match(/\d+/)) {
		return {
			type: 'constant',
			value: arg,
			value_type: 'number',
			result_type: 'number'
		};
	} else
		return {
			type: 'constant',
			value: arg,
			value_type: 'string',
			result_type: 'text'
		};
}

export function parseFormula (formula: string) {
	const result_formula: any = {
		function: '',
		args: []
	};

	let current_function = '',
		is_current_function = true,
		current_arg = '',
		is_current_arg = false;

	for (let index = 0; index < formula.length; index++) {
		const char = formula[index];
		if (char.match(/[A-Za-z0-9]/)) {
			if (is_current_function) {
				current_function += char;
				is_current_function = true;
				is_current_arg = false;
			} else if (is_current_arg) {
				current_arg += char;
				is_current_arg = true;
				is_current_function = false;
			}
		} else if (char.match(/,/)) {
			result_formula.args.push(parseArg(current_arg));
			is_current_function = false;
			current_arg = '';
			is_current_arg = true;
		} else if (char.match(/(\()/)) {
			result_formula.function = current_function;
			current_function = '';
			is_current_arg = true;
			is_current_function = false;
		} else if (char.match(/(\))/)) {
			result_formula.args.push(parseArg(current_arg));
			current_arg = '';
			is_current_arg = false;
			is_current_function = false;
		}
	}
	return result_formula;
}
