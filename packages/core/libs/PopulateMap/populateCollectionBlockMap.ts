import { NotionCache } from '@nishans/cache';
import { INotionFabricatorOptions } from '@nishans/fabricator';
import { ICollection, TCollectionBlock } from '@nishans/types';
import { NotionUtils } from '@nishans/utils';
import { IBlockMap } from '../../types';
import { createBlockClass } from '../createBlockClass';
/**
 * Populates a collection block map
 * @param block The block used to extra information to form the map
 * @param options Cache, token required to initializeCache
 * @param block_obj The block object
 * @param block_map Block map
 */
export async function populateCollectionBlockMap (
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
