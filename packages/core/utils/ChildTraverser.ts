import { iterateAndDeleteChildren, iterateAndGetChildren, iterateAndUpdateChildren } from './';

export const ChildTraverser = {
	get: iterateAndGetChildren,
	update: iterateAndUpdateChildren,
	delete: iterateAndDeleteChildren
};
