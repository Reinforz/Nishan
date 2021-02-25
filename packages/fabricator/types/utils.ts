import { ICache } from '@nishans/cache';
import { IOperation, TDataType, TTextFormat } from '@nishans/types';

export type TMethodType = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';

export type Logger = false | ((method: TMethodType, subject: TDataType, id: string) => void);

export interface ParentCollectionData {
	parent_collection_id: string;
	name: TTextFormat;
	token: string;
	logger?: Logger;
	stack: IOperation[];
	cache: ICache;
	parent_relation_schema_unit_id: string;
}
