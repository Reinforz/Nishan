let data = ``;

function constructFunctionExample (function_name, signature) {
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

	return `\`${function_name}(${arity
		? arity.map((argument) => generateArgumentFromResultType(argument)).join(', ')
		: generateArgumentFromResultType(variadic)})\``;
}

function constructSignatureTable (function_name, signatures) {
	let data = `|Arity|Result type|Example|\n|-|-|-|\n`;
	signatures.forEach((signature) => {
		const example = constructFunctionExample(function_name, signature),
			syntax = signature.arity ? signature.arity.join(',') : signature.variadic,
			result_type = signature.result_type;
		data += `|\`(${syntax})\`|\`${result_type}\`|${example}|\n`;
	});
	return `${data}\n`;
}

function_formula_info_arr
	.sort((a, b) => (a.function_name > b.function_name ? 1 : -1))
	.forEach(({ function_name, description, signatures }) => {
		data += `## ${function_name}\n\n${description}\n\n${constructSignatureTable(function_name, signatures)}`;
	});

fs.writeFileSync(__dirname + '/content.md', data);