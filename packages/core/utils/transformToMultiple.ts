import { FilterType, FilterTypes, UpdateType, UpdateTypes } from '../types';

export function transformToMultiple (arg?: FilterType<any>): FilterTypes<any>;
export function transformToMultiple (arg?: UpdateType<any, any>): UpdateTypes<any, any>;
export function transformToMultiple (
	arg?: UpdateType<any, any> | FilterType<any>
): FilterTypes<any> | UpdateTypes<any, any> {
	return typeof arg === 'string' ? [ arg ] : (arg ?? (() => true));
}
