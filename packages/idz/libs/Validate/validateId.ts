import { NotionIdz } from '..';

export const validateId = (id: string) => NotionIdz.Validate.uuid(id);
