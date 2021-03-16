import { extractCollectionData } from './collection';
import { extractPagesData } from './pages';
import { extractViewsData } from './views';

export const NotionExtract = {
	pages: extractPagesData,
	template_pages: extractPagesData,
	collection: extractCollectionData,
	views: extractViewsData
};

export * from './types';
