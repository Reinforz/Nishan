import { NotionConstants } from '@nishans/constants';
import { INotionCache } from '@nishans/types';

export function createDefaultCache () {
	const cache: INotionCache = {} as any;
	NotionConstants.dataTypes().forEach((data_type) => (cache[data_type] = new Map()));
	return cache;
}
