import { NotionCache } from '@nishans/cache';
import { NotionOperations } from '@nishans/operations';
import { INotionCoreOptions } from '../types';

export const default_nishan_arg: INotionCoreOptions = {
	cache: NotionCache.createDefaultCache(),
	id: 'block_1',
	interval: 0,
	shard_id: 123,
	space_id: 'space_1',
	token: 'token',
	user_id: 'user_root_1',
	logger: true,
	notion_operation_plugins: []
};

export const last_edited_props = {
	last_edited_time: expect.any(Number),
	last_edited_by_table: 'notion_user',
	last_edited_by_id: 'user_root_1'
};

export const o = {
	b: {
		u: NotionOperations.Chunk.block.update,
		s: NotionOperations.Chunk.block.set,
		la: NotionOperations.Chunk.block.listAfter,
		lb: NotionOperations.Chunk.block.listBefore,
		lr: NotionOperations.Chunk.block.listRemove,
		sp: NotionOperations.Chunk.block.setPermissionItem
	},
	d: {
		u: NotionOperations.Chunk.discussion.update,
		s: NotionOperations.Chunk.discussion.set,
		la: NotionOperations.Chunk.discussion.listAfter,
		lb: NotionOperations.Chunk.discussion.listBefore,
		lr: NotionOperations.Chunk.discussion.listRemove,
		sp: NotionOperations.Chunk.discussion.setPermissionItem
	},
	cm: {
		u: NotionOperations.Chunk.comment.update,
		s: NotionOperations.Chunk.comment.set,
		la: NotionOperations.Chunk.comment.listAfter,
		lb: NotionOperations.Chunk.comment.listBefore,
		lr: NotionOperations.Chunk.comment.listRemove,
		sp: NotionOperations.Chunk.comment.setPermissionItem
	},
	ur: {
		u: NotionOperations.Chunk.user_root.update,
		s: NotionOperations.Chunk.user_root.set,
		la: NotionOperations.Chunk.user_root.listAfter,
		lb: NotionOperations.Chunk.user_root.listBefore,
		lr: NotionOperations.Chunk.user_root.listRemove
	},
	sv: {
		u: NotionOperations.Chunk.space_view.update,
		s: NotionOperations.Chunk.space_view.set,
		la: NotionOperations.Chunk.space_view.listAfter,
		lb: NotionOperations.Chunk.space_view.listBefore,
		lr: NotionOperations.Chunk.space_view.listRemove
	},
	c: {
		u: NotionOperations.Chunk.collection.update,
		s: NotionOperations.Chunk.collection.set,
		la: NotionOperations.Chunk.collection.listAfter,
		lb: NotionOperations.Chunk.collection.listBefore,
		lr: NotionOperations.Chunk.collection.listRemove
	},
	s: {
		u: NotionOperations.Chunk.space.update,
		s: NotionOperations.Chunk.space.set,
		la: NotionOperations.Chunk.space.listAfter,
		lb: NotionOperations.Chunk.space.listBefore,
		lr: NotionOperations.Chunk.space.listRemove,
		spi: NotionOperations.Chunk.space.setPermissionItem
	},
	cv: {
		u: NotionOperations.Chunk.collection_view.update,
		s: NotionOperations.Chunk.collection_view.set
	}
};
