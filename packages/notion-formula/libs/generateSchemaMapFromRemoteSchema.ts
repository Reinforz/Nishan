import { INotionCacheOptions, NotionCache } from '@nishans/cache';
import { idToUuid, uuidToId } from '@nishans/idz';
import { ICollection, TCollectionBlock } from '@nishans/types';
import { NotionUtils } from '@nishans/utils';

/**
 * Generates a schema_map from a remote collection schema
 * @param token The token used to verify in notion
 * @param cb_id Id of the collection block
 * @returns The generated schema_map from the remote collection schema
 */
export async function generateSchemaMapFromRemoteSchema (cb_id: string, options: INotionCacheOptions) {
	const id = idToUuid(uuidToId(cb_id));
	await NotionCache.initializeCacheForSpecificData(id, 'block', options);
	const collection_block = options.cache.block.get(id) as TCollectionBlock;
	const collection = options.cache.collection.get(collection_block.collection_id) as ICollection;
	return NotionUtils.generateSchemaMap(collection.schema);
}
