import { extractCollectionData } from './collection';
import { extractData } from './extract';
import { extractPagesData } from './pages';
import { extractViewsData } from './views';

export const ExtractData = {
	pages: extractPagesData,
	template_pages: extractPagesData,
	collection: extractCollectionData,
	views: extractViewsData,
	extract: extractData
};
