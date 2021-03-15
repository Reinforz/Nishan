export * from '../types';
import { CreateData } from './CreateData';
import { detectChildData } from './detectChildData';
import { InitializeView } from './InitializeView';
import { PopulateViewData } from './PopulateViewData';
import { PopulateViewMaps } from './PopulateViewMaps';
import { updateChildContainer } from './updateChildContainer';

export const NotionFabricator = {
	detectChildData,
	updateChildContainer,
	PopulateViewMaps,
	CreateData,
	InitializeView,
	PopulateViewData
};
