import { ICollection, IPage, TCollectionBlock, TView } from '@nishans/types';

export interface LocalFileStructure {
	block: CollectionBlockExtracted;
	views: TViewExtracted[];
	collection: CollectionExtracted;
	row_pages: RowPageExtracted[];
	template_pages: RowPageExtracted[];
}

export interface SimplePageProps {
	title: string;
	[k: string]: string;
}

export type CollectionBlockExtracted = Pick<TCollectionBlock, 'id' | 'collection_id' | 'view_ids'>;
export type CollectionExtracted = Pick<ICollection, 'id' | 'icon' | 'cover' | 'schema' | 'parent_id'> & {
	name: string;
};
export type TViewExtracted = Pick<TView, 'id' | 'type' | 'name' | 'query2' | 'format' | 'parent_id'>;
export type RowPageExtracted = Pick<IPage, 'id' | 'format' | 'parent_id'> & { properties: SimplePageProps };

export interface NotionHeaders {
	headers: {
		cookie: string;
		'x-notion-active-user-header': string;
	};
}
