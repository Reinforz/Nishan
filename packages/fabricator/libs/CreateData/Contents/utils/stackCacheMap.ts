import { NotionOperationsObject, Operation } from '@nishans/operations';
import { TBlock } from '@nishans/types';
import { FabricatorProps } from '../..';

/**
 * * Push the block create operation to the stack
 * * Add the block data to the cache
 * * Create the corresponding class for the block
 * * Populates the passed block map, using the id and the name(optional) of the block 
 * @param block_map Block map to populate
 * @param data block data used to extract id and type from
 * @param props Nishan props passed to generated object
 * @param name Name of the block, used to create a key for the block map
 */
export async function stackCacheMap<T extends TBlock> (
	data: T,
	{ cache, shard_id, token, space_id, user_id }: FabricatorProps,
	cb?: ((data: TBlock) => any)
) {
	const { id } = data;
	await NotionOperationsObject.executeOperations(
		[ Operation.block.update(id, [], JSON.parse(JSON.stringify(data))) ],
		[],
		{ token, interval: 0, user_id },
		{ shard_id, space_id }
	);
	cache.block.set(id, JSON.parse(JSON.stringify(data)));
	cb && (await cb(data));
}
