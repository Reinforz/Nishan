import { TSchemaUnitType, IViewFilterData, TViewGroupFilterOperator } from '@nishans/types';

export interface ViewFilterCreateInput<T extends TSchemaUnitType> {
	filter: {
		operator: IViewFilterData<T>['operator'];
		type: IViewFilterData<T>['type'];
		value: IViewFilterData<T>['value'];
		filter_operator?: TViewGroupFilterOperator;
		children?: ViewFilterCreateInput<TSchemaUnitType>[];
	};
	name: string;
	type: T;
	position?: number;
}

export type TViewFilterCreateInput =
	| ViewFilterCreateInput<'checkbox'>
	| ViewFilterCreateInput<'text'>
	| ViewFilterCreateInput<'number'>
	| ViewFilterCreateInput<'select'>
	| ViewFilterCreateInput<'multi_select'>
	| ViewFilterCreateInput<'title'>
	| ViewFilterCreateInput<'date'>
	| ViewFilterCreateInput<'person'>
	| ViewFilterCreateInput<'file'>
	| ViewFilterCreateInput<'url'>
	| ViewFilterCreateInput<'email'>
	| ViewFilterCreateInput<'phone_number'>
	| ViewFilterCreateInput<'formula'>
	| ViewFilterCreateInput<'relation'>
	| ViewFilterCreateInput<'rollup'>
	| ViewFilterCreateInput<'created_time'>
	| ViewFilterCreateInput<'created_by'>
	| ViewFilterCreateInput<'last_edited_time'>
	| ViewFilterCreateInput<'last_edited_by'>;
