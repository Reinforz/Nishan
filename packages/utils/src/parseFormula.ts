const FUNCTION_REGEX = /^(concat|join|slice|toNumber|contains|replace|replaceAll|test|empty|abs|cbrt|ceil|exp|floor|ln|log10|log2|min|max|round|sign|sqrt|start|end|now|timestamp|fromTimestamp|dateAdd|dateSubtract|dateBetween|formatDate|minute|hour|day|date|month|year|unaryMinus|unaryPlus|add|subtract|multiply|divide|pow|mod|and|or|larger|largerEq|smaller|smallerEq|not|length|format|equal|unequal|if)\((.+)\)/;
const ARGS_REGEX = /((?:concat|join|slice|toNumber|contains|replace|replaceAll|test|empty|abs|cbrt|ceil|exp|floor|ln|log10|log2|min|max|round|sign|sqrt|start|end|now|timestamp|fromTimestamp|dateAdd|dateSubtract|dateBetween|formatDate|minute|hour|day|date|month|year|unaryMinus|unaryPlus|add|subtract|multiply|divide|pow|mod|and|or|larger|largerEq|smaller|smallerEq|not|length|format|equal|unequal|if)\(.+\))|(\w+)|(e|pi|true|false)|(\d+)/g;

function parseArg (arg: string) {
	const function_match = arg.match(FUNCTION_REGEX);
	if (function_match) {
		return parseFormula(function_match[0]);
	} else if (arg.match(/(true|false)/)) {
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

	const match = formula.match(FUNCTION_REGEX);
	if (match) {
		const [ , function_name, args ] = match;
		result_formula.function = function_name;
		const args_match = args.match(ARGS_REGEX);

		if (args_match) args_match.forEach((arg) => result_formula.args.push(parseArg(arg)));
	}
	return result_formula;
}
