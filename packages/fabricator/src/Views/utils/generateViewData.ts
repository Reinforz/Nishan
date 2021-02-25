import { generateId } from '@nishans/idz';
import { Operation } from '@nishans/operations';
import { TView } from '@nishans/types';
import { NishanArg } from '../../../../types';

/**
 * Construct and return the view data using the passed info and stores it in cache and operation stack
 * @param info Object containing name, id and type of the view
 * @param param1 Object containing the cache, stack to mutate
 * @param format The format to be attached to the view
 * @param query2 The query2 object to be attached to the view
 * @param parent_id The parent id of the view
 */
export function generateViewData (
	{ id, name, type, format, query2 }: Pick<TView, 'name' | 'type' | 'format' | 'query2'> & { id?: string },
	{ stack, cache, space_id, shard_id }: Pick<NishanArg, 'stack' | 'cache' | 'space_id' | 'shard_id' | 'user_id'>,
	parent_id: string
) {
	// construct the view id, using a custom id
	const view_id = generateId(id);
	// Construct the view data
	const view_data = {
		id: view_id,
		version: 0,
		type,
		name,
		page_sort: [],
		parent_id,
		parent_table: 'block',
		alive: true,
		format,
		query2,
		shard_id,
		space_id
	} as TView;
	// Push the collection_view creation operation to the stack
	stack.push(Operation.collection_view.update(view_id, [], JSON.parse(JSON.stringify(view_data))));
	// Add the view to the cache
	cache.collection_view.set(view_id, JSON.parse(JSON.stringify(view_data)));
	return view_data;
}
