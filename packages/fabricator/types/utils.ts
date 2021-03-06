import { ICache, INotionCacheOptions } from '@nishans/cache';
import { INotionOperationOptions } from '@nishans/operations';
import { TDataType, TTextFormat } from '@nishans/types';

export type TMethodType = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';

export type Logger = false | ((method: TMethodType, subject: TDataType, id: string) => void);

export interface ParentCollectionData {
	parent_collection_id: string;
	name: TTextFormat;
	parent_relation_schema_unit_id: string;
}

export interface INotionFabricatorOptions extends INotionOperationOptions, INotionCacheOptions {
	cache: ICache;
	logger?: Logger;
}
