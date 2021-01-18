import { IViewFilter, TViewFilters } from '@nishans/types';

export function extractNestedFilter (filters: (IViewFilter | TViewFilters)[], trails: number[]) {
	let parent = filters as any;

	trails.forEach((trail) => {
		if ((parent as IViewFilter).operator) parent = (parent as IViewFilter).filters;
		parent = parent[trail];
	});
	return parent as IViewFilter | TViewFilters;
}

export function extractNestedFilterParent (filters: IViewFilter | TViewFilters, trails: number[]) {
	let parent = filters as any;

	trails.forEach((trail) => {
		if ((parent as IViewFilter).operator) parent = (parent as IViewFilter).filters;
	});
	return parent as (IViewFilter | TViewFilters)[];
}
