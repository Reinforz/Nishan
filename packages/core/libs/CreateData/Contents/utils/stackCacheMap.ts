import { Operation } from '@nishans/operations';
import { TBlock } from '@nishans/types';
import { createBlockClass } from '../../..';
import { IBlockMap, NishanArg } from '../../../../src';

export function stackCacheMap<T extends TBlock> (
	block_map: IBlockMap,
	data: T,
	props: Omit<NishanArg, 'id'>,
	name?: string
) {
	const { id, type } = data;
	props.stack.push(Operation.block.update(id, [], JSON.parse(JSON.stringify(data))));
	props.cache.block.set(id, JSON.parse(JSON.stringify(data)));
	const block_obj = createBlockClass(type, id, props);
	block_map[type].set(id, block_obj);
	if (name) block_map[type].set(name, block_obj);
}
