import { createDiscussions } from './createDiscussions';
import { deleteDiscussions } from './deleteDiscussions';
import { updateDiscussions } from './updateDiscussions';

export const NotionDiscourseDiscussions = {
	create: createDiscussions,
	update: updateDiscussions,
	delete: deleteDiscussions
};
