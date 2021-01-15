import { ICollection, IPage, TCollectionBlock, TView } from '@nishans/types';

export interface LocalFileStructure {
	block: CollectionBlockExtracted;
	views: TViewExtracted[];
	collection: CollectionExtracted;
	row_pages: RowPageExtracted[];
}

export type CollectionBlockExtracted = Pick<TCollectionBlock, 'id' | 'collection_id' | 'view_ids'>;
export type CollectionExtracted = Pick<ICollection, 'id' | 'name' | 'icon' | 'cover' | 'schema' | 'parent_id'>;
export type TViewExtracted = Pick<TView, 'id' | 'type' | 'name' | 'query2' | 'format' | 'parent_id'>;
export type RowPageExtracted = Pick<IPage, 'id' | 'properties' | 'format'>;

export interface FetchDatabaseDataResult {
	block_data: TCollectionBlock;
	collection_data: ICollection;
	views_data: TView[];
	row_pages_data: IPage[];
}
