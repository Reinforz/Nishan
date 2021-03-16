import { NotionExtract } from '@nishans/extract';
import { DataShape, LocalFileStructure } from './';

export const extractData = (data: DataShape) => {
	return {
		collection: NotionExtract.collection(data.collection),
		views: NotionExtract.views(data.views),
		row_pages: NotionExtract.pages(data.row_pages),
		template_pages: NotionExtract.pages(data.template_pages)
	} as LocalFileStructure;
};
