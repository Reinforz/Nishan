import { TViewFilters, TViewGroupFilterOperator, IViewFilter } from "@nishans/types";

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

export const createEmptyFilterGroup = (operator?: TViewGroupFilterOperator, filters?: (TViewFilters | IViewFilter)[]): any => ({
	filters: filters ?? [],
	operator: operator ?? 'and'
});
