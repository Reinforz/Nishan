import { NotionCacheObject } from '@nishans/cache';
import { ICollection, TBlock, TPage } from '@nishans/types';
import { IBlockMap, IPageMap, NishanArg } from '../types';
import { createBlockClass } from '../utils';

async function populatePageMap (page: TPage, page_map: IPageMap, props: Omit<NishanArg, 'id'>) {
	const block_obj = createBlockClass(page.type, page.id, props);
	page_map[page.type].set(page.id, block_obj);

	if (page.type === 'page') {
		page_map.page.set(page.properties.title[0][0], block_obj);
	} else if (page.type === 'collection_view_page') {
		await NotionCacheObject.initializeCacheForSpecificData(page.id, 'block', props, props.cache);
		const collection = props.cache.collection.get(page.collection_id) as ICollection;
		page_map.collection_view_page.set(collection.name[0][0], block_obj);
	}
}

async function populateBlockMap (block: TBlock, block_map: IBlockMap, props: Omit<NishanArg, 'id'>) {
	if (block.type === 'page' || block.type === 'collection_view_page') {
		await PopulateMap.page(block, block_map, props);
	} else {
		const block_obj = createBlockClass(block.type, block.id, props);
		block_map[block.type].set(block.id, block_obj);
		if (block.type === 'collection_view') {
			await NotionCacheObject.initializeCacheForSpecificData(block.id, 'block', props, props.cache);
			const collection = props.cache.collection.get(block.collection_id) as ICollection;
			block_map.collection_view_page.set(collection.name[0][0], block_obj);
		}
	}
}

export const PopulateMap = {
	page: populatePageMap,
	block: populateBlockMap
};
