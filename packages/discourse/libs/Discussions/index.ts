import { createDiscussions } from './createDiscussions';
import { deleteDiscussions } from './deleteDiscussions';
import { getDiscussions } from './getDiscussions';
import { updateDiscussions } from './updateDiscussions';

export const NotionDiscourseDiscussions = {
	create: createDiscussions,
	update: updateDiscussions,
	delete: deleteDiscussions,
	get: getDiscussions
};
