import { remove } from './delete';
import { get } from './get';
import { update } from './update';

export const NotionTraverser = {
	get,
	update,
	delete: remove
};
