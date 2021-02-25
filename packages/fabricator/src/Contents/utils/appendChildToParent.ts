import { ICache, NotionCacheObject } from '@nishans/cache';
import { Operation } from '@nishans/operations';
import { IOperation } from '@nishans/types';
import { detectChildData } from '../../../libs';

/**
 * 1. Fetches parent from notion's db if it doesn't exist in cache
 * 2. Detect the child data using the parent
 * 3. Push the child id to the parent's child container
 * 4. Push a suitable operation to the operation stack for adding the child to the child container
 * @param parent_table Parent data table
 * @param parent_id Parent data id
 * @param content_id Child id
 * @param cache Cache to lookup parent
 * @param stack Stack to push operation
 * @param token Token required to fetching parent if not present in cache
 */
export async function appendChildToParent (
	parent_table: 'space' | 'block' | 'collection',
	parent_id: string,
	content_id: string,
	cache: ICache,
	stack: IOperation[],
	token: string
): Promise<void> {
	// Fetches parent from notion's db if it doesn't exist in cache
	const parent = await NotionCacheObject.fetchDataOrReturnCached(
		parent_table,
		parent_id,
		{ token, interval: 0 },
		cache
	);

	// Detect the child data using the parent
	const [ child_path ] = detectChildData(parent_table as any, parent as any);
	// Push the child id to the parent's child container
	if (!(parent as any)[child_path]) (parent as any)[child_path] = [];
	(parent as any)[child_path].push(content_id);
	// Push a suitable operation to the operation stack for adding the child to the child container
	stack.push(Operation[parent_table].listAfter(parent_id, [ child_path ], { after: '', id: content_id }));
}
