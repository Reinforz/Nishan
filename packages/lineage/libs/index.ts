import { NotionLineageBlock } from './Block';
import { NotionLineageCollection } from './Collection';
import { getPageIds } from './getPageIds';
import { NotionLineageNotionUser } from './NotionUser';
import { NotionLineagePage } from './Page';
import { positionChildren } from './positionChildren';
import { NotionLineageSpace } from './Space';
import { updateChildContainer } from './updateChildContainer';

export const NotionLineage = {
	positionChildren,
	getPageIds,
	updateChildContainer,
	Page: NotionLineagePage,
	Collection: NotionLineageCollection,
	Block: NotionLineageBlock,
	NotionUser: NotionLineageNotionUser,
	Space: NotionLineageSpace
};
export * from './types';
