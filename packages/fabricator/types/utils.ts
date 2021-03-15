import { INotionCacheOptions } from '@nishans/cache';
import { INotionOperationOptions } from '@nishans/operations';
import { TTextFormat } from '@nishans/types';

export type TMethodType = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';

export interface ParentCollectionData {
	parent_collection_id: string;
	name: TTextFormat;
	parent_relation_schema_unit_id: string;
}

export interface INotionFabricatorOptions extends INotionOperationOptions, INotionCacheOptions {}
