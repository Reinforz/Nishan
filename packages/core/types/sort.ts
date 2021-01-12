import { TSortValue } from '@nishans/types';

export type TSortCreateInput = [string, TSortValue, number] | [string, TSortValue];
export type TSortUpdateInput = TSortValue | [TSortValue, number];
