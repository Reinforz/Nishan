export const createEmptyFilter = (): any => ({
	property: '',
	filter: {
		operator: '',
		value: {
			type: '',
			value: ''
		}
	}
});

export const createEmptyFilterGroup = (): any => ({
	filters: [],
	operator: 'and'
});
