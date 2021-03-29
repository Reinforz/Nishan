import { IDiscussion } from '@nishans/types';

export const discussion = (
	arg: Pick<IDiscussion, 'resolved' | 'context' | 'comments' | 'parent_id' | 'id' | 'shard_id' | 'space_id'>
) => {
	return {
		parent_id: arg.parent_id,
		parent_table: 'block',
		context: arg.context,
		id: arg.id,
		version: 1,
		space_id: arg.space_id,
		shard_id: arg.shard_id,
		comments: arg.comments,
		resolved: arg.resolved
	} as IDiscussion;
};
