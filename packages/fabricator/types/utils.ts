import { ICache } from '@nishans/cache';
import { NotionOperationPluginFunction } from '@nishans/operations';
import { TDataType, TTextFormat } from '@nishans/types';

export type TMethodType = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';

export type Logger = false | ((method: TMethodType, subject: TDataType, id: string) => void);

export interface ParentCollectionData {
	parent_collection_id: string;
	name: TTextFormat;
	parent_relation_schema_unit_id: string;
}
export interface FabricatorProps {
	shard_id: number;
	space_id: string;
	token: string;
	user_id: string;
	interval?: number;
	cache: ICache;
	logger?: Logger;
	notion_operation_plugins: NotionOperationPluginFunction[];
}
