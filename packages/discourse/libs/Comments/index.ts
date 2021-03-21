import { createComments } from './createComments';
import { deleteComments } from './deleteComments';
import { updateComments } from './updateComments';

export const NotionDiscourseComments = {
	create: createComments,
	update: updateComments,
  delete: deleteComments
};
