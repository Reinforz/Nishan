import { createComments } from './createComments';
import { deleteComments } from './deleteComments';
import { getComments } from './getComments';
import { updateComments } from './updateComments';

export const NotionDiscourseComments = {
	create: createComments,
	update: updateComments,
	delete: deleteComments,
	get: getComments
};
