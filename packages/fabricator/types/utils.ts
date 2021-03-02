import { ICache } from '@nishans/cache';
import { NotionOperationOptions } from '@nishans/operations';
import { TDataType, TTextFormat } from '@nishans/types';

export type TMethodType = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';

export type Logger = false | ((method: TMethodType, subject: TDataType, id: string) => void);

export interface ParentCollectionData {
	parent_collection_id: string;
	name: TTextFormat;
	parent_relation_schema_unit_id: string;
}

export interface FabricatorProps extends NotionOperationOptions {
	cache: ICache;
	logger?: Logger;
}
