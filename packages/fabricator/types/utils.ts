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

export interface FabricatorProps {
	shard_id: number;
	space_id: string;
	token: string;
	user_id: string;
	cache: ICache;
	stack: IOperation[];
	logger?: Logger;
}

export interface IViewList {
	table: Array<[string, string]>;
	list: Array<[string, string]>;
	gallery: Array<[string, string]>;
	board: Array<[string, string]>;
	calendar: Array<[string, string]>;
	timeline: Array<[string, string]>;
}
