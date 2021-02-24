import { ICache } from '@nishans/cache';
import { last_edited_props } from '../../utils/lastEditedProps';
import { o } from '../../utils/operations';

// child delete operation generator
export const cdo = (id: string) =>
	o.b.u(id, [], {
		alive: false,
		...last_edited_props
	});
// child remove operation generator
export const cro = (id: string) =>
	o.b.lr('parent_one_id', [ 'content' ], {
		id
	});
// Child delete operations
export const c1do = cdo('child_one_id');
export const c2do = cdo('child_two_id');
// Child remove operations
export const c1ro = cro('child_one_id');
export const c2ro = cro('child_two_id');
// parent update operation
export const puo = o.b.u('parent_one_id', [], last_edited_props);

export const delete_props_common = {
	child_type: 'block',
	parent_id: 'parent_one_id',
	parent_type: 'block',
	user_id: 'user_root_1'
};

export const delete_props_1 = {
	...delete_props_common,
	child_path: 'content'
} as any;

export const delete_props_2 = {
	...delete_props_common,
	child_ids: 'content'
} as any;

// child data generator
export const c = (id: string) => ({
	id,
	alive: false,
	...last_edited_props
});
export const c1 = c('child_one_id');
export const c2 = c('child_two_id');

// construct child cache data
export const cc = (id: string) =>
	[
		id,
		{
			id
		}
	] as any;

// constructs the cache for all delete call
export const constructCache = (child_ids: string[]) => {
	return {
		block: new Map([
			[
				'parent_one_id',
				{
					id: 'parent_one_id',
					content: child_ids
				}
			],
			cc('child_one_id'),
			cc('child_two_id'),
			cc('child_three_id')
		])
	} as ICache;
};
