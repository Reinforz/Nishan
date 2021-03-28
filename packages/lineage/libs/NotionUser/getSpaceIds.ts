import { INotionCache } from '@nishans/types';

export function getSpaceIds (cache: INotionCache) {
	const space_ids: string[] = [];
	for (const [ space_id ] of cache.space) space_ids.push(space_id);
	return space_ids;
}
