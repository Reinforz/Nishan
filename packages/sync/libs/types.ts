import { CollectionExtracted, PageExtracted, TViewExtracted } from '@nishans/extract';
export interface INotionSyncFileShape {
	views: TViewExtracted[];
	collection: CollectionExtracted;
	row_pages: PageExtracted[];
	template_pages: PageExtracted[];
}
