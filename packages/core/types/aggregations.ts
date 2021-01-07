import { TSchemaUnitType, IViewAggregationsAggregators } from '@nishans/types';

interface ViewAggregationsCreateGenericParam<T extends TSchemaUnitType> {
	schema_type: T;
	name: string;
	aggregator: IViewAggregationsAggregators[T];
}

export type UserViewAggregationsCreateParams =
	| ViewAggregationsCreateGenericParam<'text'>
	| ViewAggregationsCreateGenericParam<'title'>
	| ViewAggregationsCreateGenericParam<'number'>
	| ViewAggregationsCreateGenericParam<'select'>
	| ViewAggregationsCreateGenericParam<'multi_select'>
	| ViewAggregationsCreateGenericParam<'date'>
	| ViewAggregationsCreateGenericParam<'person'>
	| ViewAggregationsCreateGenericParam<'file'>
	| ViewAggregationsCreateGenericParam<'checkbox'>
	| ViewAggregationsCreateGenericParam<'url'>
	| ViewAggregationsCreateGenericParam<'email'>
	| ViewAggregationsCreateGenericParam<'phone_number'>
	| ViewAggregationsCreateGenericParam<'formula'>
	| ViewAggregationsCreateGenericParam<'relation'>
	| ViewAggregationsCreateGenericParam<'rollup'>
	| ViewAggregationsCreateGenericParam<'created_time'>
	| ViewAggregationsCreateGenericParam<'created_by'>
	| ViewAggregationsCreateGenericParam<'last_edited_time'>
	| ViewAggregationsCreateGenericParam<'last_edited_by'>;
