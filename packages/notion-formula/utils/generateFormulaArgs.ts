export function generateFormulaArgs (value: any) {
	if (typeof value === 'boolean')
		return {
			type: 'symbol',
			name: value.toString(),
			result_type: 'checkbox'
		};
	else if (value.toString().match(/(e|pi)/))
		return {
			type: 'symbol',
			name: value,
			result_type: 'number'
		};
	else if (typeof value === 'number')
		return {
			type: 'constant',
			value: value.toString(),
			value_type: 'number',
			result_type: 'number'
		};
	else if (typeof value === 'string')
		return {
			type: 'constant',
			value: value.toString(),
			value_type: 'string',
			result_type: 'text'
		};
}
