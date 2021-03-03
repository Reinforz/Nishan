import { NotionCacheObject } from '@nishans/cache';
import { Operation } from '@nishans/operations';
import { NishanArg } from '../types';

export const default_nishan_arg: NishanArg = {
	cache: NotionCacheObject.createDefaultCache(),
	id: 'block_1',
	interval: 0,
	shard_id: 123,
	space_id: 'space_1',
	token: 'token',
	user_id: 'user_root_1'
};

export const last_edited_props = {
	last_edited_time: expect.any(Number),
	last_edited_by_table: 'notion_user',
	last_edited_by_id: 'user_root_1'
};

export const o = {
	b: {
		u: Operation.block.update,
		s: Operation.block.set,
		la: Operation.block.listAfter,
		lb: Operation.block.listBefore,
		lr: Operation.block.listRemove,
		sp: Operation.block.setPermissionItem
	},
	ur: {
		u: Operation.user_root.update,
		s: Operation.user_root.set,
		la: Operation.user_root.listAfter,
		lb: Operation.user_root.listBefore,
		lr: Operation.user_root.listRemove
	},
	sv: {
		u: Operation.space_view.update,
		s: Operation.space_view.set,
		la: Operation.space_view.listAfter,
		lb: Operation.space_view.listBefore,
		lr: Operation.space_view.listRemove
	},
	c: {
		u: Operation.collection.update,
		s: Operation.collection.set,
		la: Operation.collection.listAfter,
		lb: Operation.collection.listBefore,
		lr: Operation.collection.listRemove
	},
	s: {
		u: Operation.space.update,
		s: Operation.space.set,
		la: Operation.space.listAfter,
		lb: Operation.space.listBefore,
		lr: Operation.space.listRemove,
		spi: Operation.space.setPermissionItem
	},
	cv: {
		u: Operation.collection_view.update,
		s: Operation.collection_view.set
	}
};
