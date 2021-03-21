import { reopenDiscussions } from './reopenDiscussions';
import { resolveDiscussions } from './resolveDiscussions';
import { startDiscussions } from './startDiscussions';

export const NotionDiscourseDiscussions = {
	start: startDiscussions,
	resolve: resolveDiscussions,
	reopen: reopenDiscussions
};
