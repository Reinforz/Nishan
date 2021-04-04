import { NotionOperations } from '@nishans/operations';
import { TBlock } from '@nishans/types';
import { INotionFabricatorOptions } from '../../../';

/**
 * * Push the block create operation to the stack
 * * Add the block data to the cache
 * * Create the corresponding class for the block
 * * Populates the passed block map, using the id and the name(optional) of the block 
 * @param block_map Block map to populate
 * @param data block data used to extract id and type from
 * @param options Nishan options passed to generated object
 * @param name Name of the block, used to create a key for the block map
 */
export async function executeOperationAndStoreInCache<T extends TBlock> (
	data: T,
	options: Omit<INotionFabricatorOptions, 'cache_init_tracker'>,
	cb?: ((data: TBlock) => any)
) {
	const { id } = data;
	options.cache.block.set(id, data);
	cb && (await cb(data));
	return NotionOperations.Chunk.block.update(id, [], JSON.parse(JSON.stringify(data)));
}
