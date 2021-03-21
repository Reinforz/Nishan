import { NotionConstants } from '@nishans/constants';
import { ICache } from './';

export function createDefaultCache () {
	const cache: ICache = {} as any;
	NotionConstants.dataTypes().forEach((data_type) => (cache[data_type] = new Map()));
	return cache;
}
