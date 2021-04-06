export * from '../types';
import { CoreApi } from './api';
import { createBlockClass } from './createBlockClass';
import { CreateMaps } from './CreateMaps';
import { PopulateMap } from './PopulateMap';

export const NotionCore = {
	API: CoreApi,
	createBlockClass,
	PopulateMap,
	CreateMaps
};
