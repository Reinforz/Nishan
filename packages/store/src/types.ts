import { ICollection, TCollectionBlock, TView } from '@nishans/types';

export interface LocalFileStructure {
	block: TCollectionBlock;
	views: TView[];
	collection: ICollection;
}

export type CollectionBlockExtracted = Pick<TCollectionBlock, 'id' | 'collection_id' | 'view_ids'>;
export type CollectionExtracted = Pick<ICollection, 'id' | 'name' | 'icon' | 'cover' | 'schema' | 'parent_id'>;
export type TViewExtracted = Pick<TView, 'id' | 'type' | 'name' | 'query2' | 'format' | 'parent_id'>;
