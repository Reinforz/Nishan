import { IViewAggregationsAggregators, TSchemaUnitType } from '@nishans/types';

interface IAggregationsCreateInput<T extends TSchemaUnitType> {
	type: T;
	name: string;
	aggregator: IViewAggregationsAggregators[T];
}

interface IAggregationsUpdateInput<T extends TSchemaUnitType> {
	type: T;
	aggregator: IViewAggregationsAggregators[T];
}

export type TAggregationsCreateInput =
	| IAggregationsCreateInput<'text'>
	| IAggregationsCreateInput<'title'>
	| IAggregationsCreateInput<'number'>
	| IAggregationsCreateInput<'select'>
	| IAggregationsCreateInput<'multi_select'>
	| IAggregationsCreateInput<'date'>
	| IAggregationsCreateInput<'person'>
	| IAggregationsCreateInput<'file'>
	| IAggregationsCreateInput<'checkbox'>
	| IAggregationsCreateInput<'url'>
	| IAggregationsCreateInput<'email'>
	| IAggregationsCreateInput<'phone_number'>
	| IAggregationsCreateInput<'formula'>
	| IAggregationsCreateInput<'relation'>
	| IAggregationsCreateInput<'rollup'>
	| IAggregationsCreateInput<'created_time'>
	| IAggregationsCreateInput<'created_by'>
	| IAggregationsCreateInput<'last_edited_time'>
	| IAggregationsCreateInput<'last_edited_by'>;

export type TAggregationsUpdateInput =
	| IAggregationsUpdateInput<'text'>
	| IAggregationsUpdateInput<'title'>
	| IAggregationsUpdateInput<'number'>
	| IAggregationsUpdateInput<'select'>
	| IAggregationsUpdateInput<'multi_select'>
	| IAggregationsUpdateInput<'date'>
	| IAggregationsUpdateInput<'person'>
	| IAggregationsUpdateInput<'file'>
	| IAggregationsUpdateInput<'checkbox'>
	| IAggregationsUpdateInput<'url'>
	| IAggregationsUpdateInput<'email'>
	| IAggregationsUpdateInput<'phone_number'>
	| IAggregationsUpdateInput<'formula'>
	| IAggregationsUpdateInput<'relation'>
	| IAggregationsUpdateInput<'rollup'>
	| IAggregationsUpdateInput<'created_time'>
	| IAggregationsUpdateInput<'created_by'>
	| IAggregationsUpdateInput<'last_edited_time'>
	| IAggregationsUpdateInput<'last_edited_by'>;
