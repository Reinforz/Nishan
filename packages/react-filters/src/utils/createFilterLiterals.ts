import { TViewFilters } from "@nishans/types";

export const createEmptyFilter = (): TViewFilters => ({
	property: 'title',
	filter: {
		operator: 'string_is',
		value: {
			type: 'exact',
			value: ''
		}
	}
});

export const createEmptyFilterGroup = (): any => ({
	filters: [],
	operator: 'and'
});
