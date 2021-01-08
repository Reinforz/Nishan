import { TSchemaUnitType, IViewFilterData, TViewGroupFilterOperator } from '@nishans/types';

export interface IViewFilterCreateInput<T extends TSchemaUnitType> {
	filter: IViewFilterData[T]['filter'];
	filter_operator?: TViewGroupFilterOperator;
	children?: TViewFilterCreateInput[];
	name: string;
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
