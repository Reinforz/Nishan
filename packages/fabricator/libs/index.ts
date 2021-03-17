export * from '../types';
import { CreateData } from './CreateData';
import { InitializeView } from './InitializeView';
import { PopulateViewData } from './PopulateViewData';
import { PopulateViewMaps } from './PopulateViewMaps';

export const NotionFabricator = {
	PopulateViewMaps,
	CreateData,
	InitializeView,
	PopulateViewData
};
