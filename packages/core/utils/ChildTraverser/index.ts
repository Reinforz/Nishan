import { remove } from './delete';
import { get } from './get';
import { update } from './update';

export const ChildTraverser = {
	get,
	update,
	delete: remove
};
