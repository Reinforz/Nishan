import { TViewFilters, TViewGroupFilterOperator } from "@nishans/types";

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

export const createEmptyFilterGroup = (operator?: TViewGroupFilterOperator): any => ({
	filters: [],
	operator: operator ?? 'and'
});
