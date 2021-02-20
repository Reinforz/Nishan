import { IPageMap } from '../../types';

/**
 * Returns an object with keys representing all the page types, and values containing a map of objects representing those page types
 */
export function createPageMap () {
	return {
		page: new Map(),
		collection_view_page: new Map()
	} as IPageMap;
}
