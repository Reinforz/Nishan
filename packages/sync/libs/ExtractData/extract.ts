import { LocalFileStructure } from '../';
import { extractCollectionData } from './collection';
import { extractPagesData } from './pages';
import { DataShape } from './types';
import { extractViewsData } from './views';

export const extractData = (data: DataShape) => {
	return {
		collection: extractCollectionData(data.collection),
		views: extractViewsData(data.views),
		row_pages: extractPagesData(data.row_pages),
		template_pages: extractPagesData(data.template_pages)
	} as LocalFileStructure;
};
