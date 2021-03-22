import { NotionCache } from '@nishans/cache';
import { ICollection, TBlock, TCollectionBlock, TPage, TTextFormat } from '@nishans/types';
import { NotionUtils } from '@nishans/utils';
import { INotionFabricatorOptions } from 'packages/fabricator/dist/libs';
import { IBlockMap, IPageMap } from '../types';
import { createBlockClass } from './createBlockClass';

/**
 * Populates a collection block map
 * @param block The block used to extra information to form the map
 * @param options Cache, token required to initializeCache
 * @param block_obj The block object
 * @param block_map Block map
 */
async function populateCollectionBlockMap (
	block: TCollectionBlock,
	options: INotionFabricatorOptions,
	block_map: IBlockMap
) {
	const block_obj = createBlockClass(block.type, block.id, options);
	// Initializes the cache for the passed data, so that collection and collection_views exists in the cache
	await NotionCache.initializeCacheForSpecificData(block.id, 'block', options);
	// Retrieve the collection from the cache
	const collection = options.cache.collection.get(block.collection_id) as ICollection;
	// Set the map corresponding to the block type to the block object passed using the collection name and the block id
	block_map[block.type].set(NotionUtils.extractInlineBlockContent(collection.name), block_obj as any);
	block_map[block.type].set(block.id, block_obj as any);
}

/**
 * Populates a page map
 * @param page Page block object
 * @param page_map Page map to add Page class to
 * @param options Props passed to the class ctors
 */
async function populatePageMap (page: TPage, page_map: IPageMap, options: INotionFabricatorOptions) {
	if (page.type === 'page') {
		// If page is of type page,
		// 1. Construct a page object
		// 2. Add the page object to the page map using the name and id as key
		const block_obj = createBlockClass(page.type, page.id, options);
		page_map.page.set(page.id, block_obj);
		page_map.page.set(NotionUtils.extractInlineBlockContent(page.properties.title), block_obj);
	} else await PopulateMap.collection_block(page, options, page_map as any);
}

/**
 * Generates block object and attaches them to corresponding key of the block map using name and id of the block as key
 * @param block block object
 * @param block_map Block map to populate
 * @param options Props passed to the block classes
 */
async function populateBlockMap (block: TBlock, block_map: IBlockMap, options: INotionFabricatorOptions) {
	if (block.type === 'page' || block.type === 'collection_view_page') await PopulateMap.page(block, block_map, options);
	else if (block.type === 'collection_view') await PopulateMap.collection_block(block, options, block_map);
	else {
		const block_obj = createBlockClass(block.type, block.id, options);
		block_map[block.type].set(block.id, block_obj);
		const title = (block as any).properties?.title as TTextFormat;
		if (title) block_map[block.type].set(NotionUtils.extractInlineBlockContent(title), block_obj);
	}
}

export const PopulateMap = {
	page: populatePageMap,
	block: populateBlockMap,
	collection_block: populateCollectionBlockMap
};
