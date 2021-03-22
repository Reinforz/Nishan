import { detectChildData } from './detectChildData';
import { NotionLineagePage } from './Page';
import { positionChildren } from './positionChildren';
import { updateChildContainer } from './updateChildContainer';

export const NotionLineage = {
	detectChildData,
	positionChildren,
	updateChildContainer,
	Page: NotionLineagePage
};
export * from './types';
