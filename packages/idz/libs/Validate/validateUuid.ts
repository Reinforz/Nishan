import { NotionIdz } from '..';

export const validateUuid = (id: string) =>
	Boolean(
		NotionIdz.Transform.toUuid(NotionIdz.Transform.toId(id)).match(/^[a-z0-9]{8}-(?:[a-z0-9]{4}-){3}[a-z0-9]{12}$/)
	);
