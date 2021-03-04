import { TSchemaUnit } from '@nishans/types';

export declare type ISchemaMapValue = {
	schema_id: string;
} & TSchemaUnit;
export declare type ISchemaMap = Map<string, ISchemaMapValue>;
