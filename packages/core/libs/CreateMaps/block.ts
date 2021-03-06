import { NotionConstants } from '@nishans/constants';
import { IBlockMap } from '../../types';

/**
 * Returns an object with keys representing all the block types, and values containing a map of objects representing those block types
 */
export function block () {
	const obj: IBlockMap = {} as any;
	NotionConstants.blockTypes().map((block_type) => (obj[block_type] = new Map()));
	return obj;
}
