import { INotionFabricatorOptions } from '@nishans/fabricator';
import { TPage } from '@nishans/types';
import { NotionUtils } from '@nishans/utils';
import { IPageMap } from '../../types';
import { createBlockClass } from '../createBlockClass';
import { PopulateMap } from './';

/**
 * Populates a page map
 * @param page Page block object
 * @param page_map Page map to add Page class to
 * @param options Props passed to the class ctors
 */
export async function populatePageMap (page: TPage, page_map: IPageMap, options: INotionFabricatorOptions) {
	if (page.type === 'page') {
		// If page is of type page,
		// 1. Construct a page object
		// 2. Add the page object to the page map using the name and id as key
		const block_obj = createBlockClass(page.type, page.id, options);
		page_map.page.set(page.id, block_obj);
		if (page.properties?.title) {
			page_map.page.set(NotionUtils.extractInlineBlockContent(page.properties.title), block_obj);
		}
	} else await PopulateMap.collectionBlock(page, options, page_map as any);
}
