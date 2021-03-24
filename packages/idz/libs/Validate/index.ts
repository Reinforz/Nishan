import { validateId } from './validateId';
import { validateUuid } from './validateUuid';

export const NotionIdzValidate = {
	uuid: validateUuid,
	id: validateId
};
