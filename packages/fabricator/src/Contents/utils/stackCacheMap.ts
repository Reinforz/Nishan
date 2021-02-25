import { Operation } from '@nishans/operations';
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
export function stackCacheMap<T extends TBlock> (data: T, props: FabricatorProps, name?: string) {
	const { id } = data;
	props.stack.push(Operation.block.update(id, [], JSON.parse(JSON.stringify(data))));
	props.cache.block.set(id, JSON.parse(JSON.stringify(data)));
	/* const block_obj = createBlockClass(type, id, props);
	block_map[type].set(id, block_obj);
	if (name) block_map[type].set(name, block_obj); */
}
