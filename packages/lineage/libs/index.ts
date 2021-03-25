import { NotionLineageBlock } from './Block';
import { NotionLineagePage } from './Page';
import { positionChildren } from './positionChildren';
import { updateChildContainer } from './updateChildContainer';

export const NotionLineage = {
	positionChildren,
	updateChildContainer,
	Page: NotionLineagePage,
	Block: NotionLineageBlock
};
export * from './types';
