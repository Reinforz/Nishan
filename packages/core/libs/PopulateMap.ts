import { NotionCacheObject } from '@nishans/cache';
import { ICollection, TBlock, TCollectionBlock, TPage } from '@nishans/types';
import { CollectionView, CollectionViewPage } from '../src';
import { IBlockMap, IPageMap, NishanArg } from '../types';
import { createBlockClass } from './createBlockClass';

async function populateCollectionBlockMap (
	block: TCollectionBlock,
	props: Omit<NishanArg, 'id'>,
	block_obj: CollectionView | CollectionViewPage,
	block_map: IBlockMap
) {
	await NotionCacheObject.initializeCacheForSpecificData(block.id, 'block', props, props.cache);
	const collection = props.cache.collection.get(block.collection_id) as ICollection;
	block_map[block.type].set(collection.name[0][0], block_obj as any);
}

async function populatePageMap (page: TPage, page_map: IPageMap, props: Omit<NishanArg, 'id'>) {
	const block_obj = createBlockClass(page.type, page.id, props);
	page_map[page.type].set(page.id, block_obj);

	if (page.type === 'page') page_map.page.set(page.properties.title[0][0], block_obj);
	else await PopulateMap.collection_block(page, props, block_obj, page_map as any);
}

async function populateBlockMap (block: TBlock, block_map: IBlockMap, props: Omit<NishanArg, 'id'>) {
	if (block.type === 'page' || block.type === 'collection_view_page') {
		await PopulateMap.page(block, block_map, props);
	} else {
		const block_obj = createBlockClass(block.type, block.id, props);
		block_map[block.type].set(block.id, block_obj);
		if (block.type === 'collection_view') await PopulateMap.collection_block(block, props, block_obj, block_map);
	}
}

export const PopulateMap = {
	page: populatePageMap,
	block: populateBlockMap,
	collection_block: populateCollectionBlockMap
};
