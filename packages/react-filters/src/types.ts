import { IViewFilter, TSchemaUnitType } from '@nishans/types';

export type TSchemaInfo = [TSchemaUnitType, string, string][];

export type TFilterItemValue = 'string' | 'checkbox' | 'date' | 'number' | 'options' | null;

export interface FilterGroupProps {
	filter: IViewFilter;
	trails: number[];
	parent_filter: IViewFilter | null;
}
