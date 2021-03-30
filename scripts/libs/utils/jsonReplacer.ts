export const jsonReplacer = (_: string, value: any) => {
	if (value instanceof Map) {
		return {
			dataType: 'Map',
			value: Array.from(value.entries()) // or with spread: value: [...value]
		};
	} else {
		return value;
	}
};
