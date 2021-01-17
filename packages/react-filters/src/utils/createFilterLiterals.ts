export const returnEmptyFilter = (): any => ({
	property: '',
	filter: {
		operator: '',
		value: {
			type: '',
			value: ''
		}
	}
});

export const returnEmptyFilterGroup = (): any => ({
	filters: [],
	operator: 'and'
});
