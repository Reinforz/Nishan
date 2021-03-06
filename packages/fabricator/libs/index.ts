export * from '../types';
import { constructLogger } from './constructLogger';
import { CreateData } from './CreateData';
import { detectChildData } from './detectChildData';
import { InitializeView } from './InitializeView';
import { PopulateViewData } from './PopulateViewData';
import { PopulateViewMaps } from './PopulateViewMaps';
import { updateChildContainer } from './updateChildContainer';

export const NotionFabricator = {
	constructLogger,
	detectChildData,
	updateChildContainer,
	PopulateViewMaps,
	CreateData,
	InitializeView,
	PopulateViewData
};
