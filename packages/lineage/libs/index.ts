import { NotionLineageBlock } from './Block';
import { NotionLineageCollection } from './Collection';
import { NotionLineagePage } from './Page';
import { positionChildren } from './positionChildren';
import { updateChildContainer } from './updateChildContainer';

export const NotionLineage = {
	positionChildren,
	updateChildContainer,
	Page: NotionLineagePage,
	Collection: NotionLineageCollection,
	Block: NotionLineageBlock
};
export * from './types';
