import { ICache } from '@nishans/cache';
import { IOperation, TTextFormat } from '@nishans/types';
import { Logger } from '../../types';

export interface ParentCollectionData {
	parent_collection_id: string;
	name: TTextFormat;
	token: string;
	logger?: Logger;
	stack: IOperation[];
	cache: ICache;
	parent_relation_schema_unit_id: string;
}
