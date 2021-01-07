import { TSchemaUnitType, IViewFilterData, TViewGroupFilterOperator } from '@nishans/types';

interface ViewFilterCreateGenericParam<T extends TSchemaUnitType> {
	schema_type: T;
	operator: IViewFilterData<T>['operator'];
	type: IViewFilterData<T>['type'];
	value: IViewFilterData<T>['value'];
	position?: number;
	name: string;
}

export type UserViewFilterCreateParams =
	| ViewFilterCreateGenericParam<'text'>
	| ViewFilterCreateGenericParam<'title'>
	| ViewFilterCreateGenericParam<'number'>
	| ViewFilterCreateGenericParam<'select'>
	| ViewFilterCreateGenericParam<'multi_select'>
	| ViewFilterCreateGenericParam<'date'>
	| ViewFilterCreateGenericParam<'person'>
	| ViewFilterCreateGenericParam<'file'>
	| ViewFilterCreateGenericParam<'checkbox'>
	| ViewFilterCreateGenericParam<'url'>
	| ViewFilterCreateGenericParam<'email'>
	| ViewFilterCreateGenericParam<'phone_number'>
	| ViewFilterCreateGenericParam<'formula'>
	| ViewFilterCreateGenericParam<'relation'>
	| ViewFilterCreateGenericParam<'rollup'>
	| ViewFilterCreateGenericParam<'created_time'>
	| ViewFilterCreateGenericParam<'created_by'>
	| ViewFilterCreateGenericParam<'last_edited_time'>
	| ViewFilterCreateGenericParam<'last_edited_by'>;

export interface ViewFilterCreateInput<T extends TSchemaUnitType> {
	operator: IViewFilterData<T>['operator'];
	type: IViewFilterData<T>['type'];
	value: IViewFilterData<T>['value'];
	position?: number;
	filters?: ViewFilterCreateInputFilters<TSchemaUnitType>[];
	filter_operator?: TViewGroupFilterOperator;
}

interface ViewFilterCreateInputFilters<T extends TSchemaUnitType> extends ViewFilterCreateInput<T> {
	schema_unit: T;
	property: string;
}
