import { ICache } from '@nishans/cache';
import { last_edited_props } from '../../utils/lastEditedProps';
import { o } from '../../utils/operations';

export const c1id = 'child_one_id';
export const c2id = 'child_two_id';
export const c3id = 'child_three_id';
export const p1id = 'parent_one_id';

// delete operation generator
export const cdo = (id: string) =>
	o.b.u(id, [], {
		alive: false,
		...last_edited_props
	});
export const cuo = (id: string) =>
	o.b.u(id, [], {
		data: id,
		...last_edited_props
	});
// child remove operation generator
export const cro = (id: string) =>
	o.b.lr(p1id, [ 'content' ], {
		id
	});
// Child delete operations
export const c1do = cdo(c1id);
export const c2do = cdo(c2id);
// Child update operations
export const c1uo = cuo(c1id);
export const c2uo = cuo(c2id);
// Child remove operations
export const c1ro = cro(c1id);
export const c2ro = cro(c2id);
// parent update operation
export const p1uo = o.b.u(p1id, [], last_edited_props);

export const delete_props_common = {
	child_type: 'block',
	parent_id: p1id,
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

export const update_props = {
	child_type: 'block',
	parent_id: p1id,
	parent_type: 'block',
	user_id: 'user_root_1'
} as any;

// deleted child data generator
export const dcd = (id: string) => ({
	id,
	alive: false,
	...last_edited_props
});
// deleted child data
export const dc1d = dcd(c1id);
export const dc2d = dcd(c2id);

// updated child data generator
export const ucd: any = (id: string) => ({
	id,
	data: id,
	...last_edited_props
});
// updated child data
export const uc1d = ucd(c1id);
export const uc2d = ucd(c2id);
export const up1d: any = {
	id: p1id,
	content: [ c1id, c2id, c3id ],
	...last_edited_props
};
// data generator
export const d: any = (id: string) => ({ id });

// cache data generator
export const cd: any = (id: string) => [
	id,
	{
		id
	}
];

// constructs the cache for all delete call
export const constructCache = (child_ids: string[]) => {
	return {
		block: new Map([
			[
				p1id,
				{
					id: p1id,
					content: child_ids
				}
			],
			cd(c1id),
			cd(c2id),
			cd(c3id)
		])
	} as ICache;
};
