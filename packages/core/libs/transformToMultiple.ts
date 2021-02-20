import { FilterType, FilterTypes, UpdateType, UpdateTypes } from '../types';

/**
 * Transforms the parameter that is suitable to be used in a multiple=true internal method
 * @param arg The argument to transform
 */
export function transformToMultiple (arg?: FilterType<any>): FilterTypes<any>;
export function transformToMultiple (arg?: UpdateType<any, any>): UpdateTypes<any, any>;
export function transformToMultiple (
	arg?: UpdateType<any, any> | FilterType<any>
): FilterTypes<any> | UpdateTypes<any, any> {
	return typeof arg === 'string' ? [ arg ] : (Array.isArray(arg) ? [arg] : arg ?? (() => true));
}
