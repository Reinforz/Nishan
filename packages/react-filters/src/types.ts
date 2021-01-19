import { IViewFilter, SelectOption, TSchemaUnitType } from '@nishans/types';

export type TSchemaInfo = [TSchemaUnitType, string, string][];

export type TFilterItemValue = 'string' | 'checkbox' | 'date' | 'number' | 'options' | SelectOption[] | null;

export interface FilterGroupProps {
	filter: IViewFilter;
	trails: number[];
	parent_filter: IViewFilter | null;
}
