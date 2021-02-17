import { IViewFilterData, TSchemaUnitType, TViewGroupFilterOperator } from '@nishans/types';

export interface IViewFilterCreateInput<T extends TSchemaUnitType> {
	filter: IViewFilterData[T]['filter'];
	filter_operator?: TViewGroupFilterOperator;
	children?: TViewFilterCreateInput[];
	name: string;
	type: T;
	position?: number;
}

export interface IViewFilterUpdateInput<T extends TSchemaUnitType> {
	filter: IViewFilterData[T]['filter'];
	filter_operator?: TViewGroupFilterOperator;
	children?: TViewFilterCreateInput[];
	type: T;
	position?: number;
}

export type TViewFilterCreateInput =
	| IViewFilterCreateInput<'checkbox'>
	| IViewFilterCreateInput<'text'>
	| IViewFilterCreateInput<'number'>
	| IViewFilterCreateInput<'select'>
	| IViewFilterCreateInput<'multi_select'>
	| IViewFilterCreateInput<'title'>
	| IViewFilterCreateInput<'date'>
	| IViewFilterCreateInput<'person'>
	| IViewFilterCreateInput<'file'>
	| IViewFilterCreateInput<'url'>
	| IViewFilterCreateInput<'email'>
	| IViewFilterCreateInput<'phone_number'>
	| IViewFilterCreateInput<'formula'>
	| IViewFilterCreateInput<'relation'>
	| IViewFilterCreateInput<'rollup'>
	| IViewFilterCreateInput<'created_time'>
	| IViewFilterCreateInput<'created_by'>
	| IViewFilterCreateInput<'last_edited_time'>
	| IViewFilterCreateInput<'last_edited_by'>;

export type TViewFilterUpdateInput =
	| IViewFilterUpdateInput<'checkbox'>
	| IViewFilterUpdateInput<'text'>
	| IViewFilterUpdateInput<'number'>
	| IViewFilterUpdateInput<'select'>
	| IViewFilterUpdateInput<'multi_select'>
	| IViewFilterUpdateInput<'title'>
	| IViewFilterUpdateInput<'date'>
	| IViewFilterUpdateInput<'person'>
	| IViewFilterUpdateInput<'file'>
	| IViewFilterUpdateInput<'url'>
	| IViewFilterUpdateInput<'email'>
	| IViewFilterUpdateInput<'phone_number'>
	| IViewFilterUpdateInput<'formula'>
	| IViewFilterUpdateInput<'relation'>
	| IViewFilterUpdateInput<'rollup'>
	| IViewFilterUpdateInput<'created_time'>
	| IViewFilterUpdateInput<'created_by'>
	| IViewFilterUpdateInput<'last_edited_time'>
	| IViewFilterUpdateInput<'last_edited_by'>;
