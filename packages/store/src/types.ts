import { ICollection, IPage, TCollectionBlock, TView } from '@nishans/types';

export interface LocalFileStructure {
	views: TViewExtracted[];
	collection: CollectionExtracted;
	row_pages: RowPageExtracted[];
	template_pages: RowPageExtracted[];
}

export interface SimplePageProps {
	title: string;
	[k: string]: string;
}

export type CollectionBlockExtracted = Pick<TCollectionBlock, 'collection_id' | 'view_ids'>;
export type CollectionExtracted = Pick<ICollection, 'icon' | 'cover' | 'schema'> & {
	name: string;
};
export type TViewExtracted = Pick<TView, 'type' | 'name' | 'query2' | 'format'>;
export type RowPageExtracted = Pick<IPage, 'format'> & { properties: SimplePageProps };

export interface FetchDatabaseDataResult {
	collection_data: ICollection;
	views_data: TView[];
	row_pages_data: IPage[];
	template_pages_data: IPage[];
}
