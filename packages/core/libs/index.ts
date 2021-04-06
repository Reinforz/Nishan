export * from '../types';
import { CoreApi } from './Api';
import { createBlockClass } from './createBlockClass';
import { CreateMaps } from './CreateMaps';
import { PopulateMap } from './PopulateMap';

export const NotionCore = {
	Api: CoreApi,
	createBlockClass,
	PopulateMap,
	CreateMaps
};
