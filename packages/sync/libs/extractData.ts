import { CollectionExtracted, NotionExtract, PageExtracted, TViewExtracted } from '@nishans/extract';
import { ICollection, IPage, TView } from '@nishans/types';
import { INotionSyncFileShape } from './';

export interface IPreExtractDataShape {
	collection: ICollection | CollectionExtracted;
	views: TView[] | TViewExtracted[];
	row_pages: IPage[] | PageExtracted[];
	template_pages: IPage[] | PageExtracted[];
}

export const extractData = (data: IPreExtractDataShape) => {
	return {
		collection: NotionExtract.collection(data.collection),
		views: NotionExtract.views(data.views),
		row_pages: NotionExtract.pages(data.row_pages),
		template_pages: NotionExtract.pages(data.template_pages)
	} as INotionSyncFileShape;
};
