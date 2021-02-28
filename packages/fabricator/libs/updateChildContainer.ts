import { NotionCacheObject } from '@nishans/cache';
import { NotionOperationsObject, Operation } from '@nishans/operations';
import { TDataType } from '@nishans/types';
import { detectChildData } from '.';
import { FabricatorProps } from '../types';

/**
 * Update the operation stack and parent's child container by either removing or adding the it based on the `keep` parameter
 * @param parent_data The parent data
 * @param keep Boolean indicating or not to keep the child id
 * @param child_id The child id
 * @param child_path The child path, ie the key in the parent_data that stores the child ids
 * @param stack Stack where to push the operation to
 * @param parent_type The parent data type
 */
export async function updateChildContainer (
	parent_table: TDataType,
	parent_id: string,
	keep: boolean,
	child_id: string,
	{ token, cache, user_id, space_id, shard_id }: FabricatorProps
) {
	const parent_data = await NotionCacheObject.fetchDataOrReturnCached(
		parent_table,
		parent_id,
		{ token, interval: 0 },
		cache
	);
	const [ child_path ] = detectChildData(parent_table as any, parent_data as any);

	if (!(parent_data as any)[child_path]) (parent_data as any)[child_path] = [];
	// Extract the child container from the parent using child_path
	const container = (parent_data as any)[child_path] as string[];
	let method: keyof typeof Operation['block'] = 'listRemove';
	// If the child container contains the child and it should not be kept
	// 1. Remove the child id from the child container
	// 2. Push to corresponding operation to the passed stack
	if (!keep && container.includes(child_id)) {
		(parent_data as any)[child_path] = container.filter((page_id) => page_id !== child_id) as any;
		method = 'listRemove';
	} else if (keep && !container.includes(child_id)) {
		// If the child container doesn't contains the child and it should be kept
		// 1. Add the child id to the child container
		// 2. Push to corresponding operation to the passed stack
		container.push(child_id);
		method = 'listAfter';
	}

	await NotionOperationsObject.executeOperations(
		[
			Operation[parent_table][method](parent_data.id, [ child_path ], {
				id: child_id
			})
		],
		[],
		{
			token,
			user_id,
			interval: 0
		},
		{
			space_id,
			shard_id
		}
	);
}
