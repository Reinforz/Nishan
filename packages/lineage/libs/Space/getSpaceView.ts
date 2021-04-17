import { INotionCache, ISpaceView } from '@nishans/types';

export function getSpaceView (space_id: string, cache: INotionCache) {
	let target_space_view: ISpaceView | null = null;
	for (const [ , space_view ] of cache.space_view) {
		if (space_view.space_id === space_id) {
			target_space_view = space_view;
			break;
		}
	}
	return target_space_view;
}
