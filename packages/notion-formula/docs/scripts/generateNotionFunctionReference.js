const fs = require("fs");
const {function_formula_info_arr} = require("../../dist/src");

let data = `Notion provides a vast array of functions capable of some extremely powerful stuffs.

The table below provides description of all the functions notion provides.

`;

function constructFunctionExample (function_name, operator, signature) {
	const { arity, variadic } = signature;
	function generateArgumentFromResultType (result_type) {
		switch (result_type) {
			case 'checkbox':
				return 'true';
			case 'date':
				return 'now()';
			case 'number':
				return 1;
			case 'text':
				if (function_name.match(/(dateAdd|dateBetween|dateSubtract)/)) return '"seconds"';
				return '"text"';
		}
	}

  const function_example = `\`${function_name}(${arity
		? arity.map((argument) => generateArgumentFromResultType(argument)).join(', ')
    : generateArgumentFromResultType(variadic)})\``
  const operator_example = `\`${(operator && !variadic && arity.length < 3) ? (arity.length === 1 ? `${operator} ${generateArgumentFromResultType(arity[0])}` : arity.map((argument) => generateArgumentFromResultType(argument)).join(` ${operator} `)) : null}\``;
	return `${function_example} | ${operator_example}`;
}

function constructSignatureTable (function_name, operator, signatures) {
	let data = `|Arity|Result type|Example (Function)|Example (Operator)|\n|-|-|-|-|\n`;
	signatures.forEach((signature) => {
		const example = constructFunctionExample(function_name, operator, signature),
			syntax = signature.arity ? signature.arity.join(',') : signature.variadic,
			result_type = signature.result_type;
		data += `|\`(${syntax})\`|\`${result_type}\`|${example}|\n`;
	});
	return `${data}\n`;
}

function_formula_info_arr
	.sort((a, b) => (a.function_name > b.function_name ? 1 : -1))
	.forEach(({ function_name, description, operator, signatures }) => {
		data += `## ${function_name}\n\n${description}\n\n${constructSignatureTable(function_name, operator, signatures)}`;
	});

fs.writeFileSync(__dirname + '/content.md', data);