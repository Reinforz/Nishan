import { Operation } from '@nishans/operations';
import { TView, TViewQuery2 } from '@nishans/types';
import { TViewFormat } from '.';
import { generateId } from '../../../../libs';
import { NishanArg, TViewCreateInput } from '../../../../types';

export function generateViewData (
	{ id, name, type }: Pick<TViewCreateInput, 'id' | 'name' | 'type'>,
	{ stack, cache, space_id, shard_id }: Pick<NishanArg, 'stack' | 'cache' | 'space_id' | 'shard_id' | 'user_id'>,
	format: TViewFormat,
	query2: TViewQuery2,
	parent_id?: string
) {
	const view_id = generateId(id);
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
	stack.push(Operation.collection_view.set(view_id, [], JSON.parse(JSON.stringify(view_data))));
	cache.collection_view.set(view_id, JSON.parse(JSON.stringify(view_data)));
	return view_data;
}
