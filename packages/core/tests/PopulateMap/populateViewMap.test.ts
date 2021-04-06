import { NotionCache } from '@nishans/cache';
import { NotionCore } from '../../libs';
import { default_nishan_arg } from '../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it('PopulateMap.view', () => {
	const view_map = NotionCore.CreateMaps.view();

	const cache = NotionCache.createDefaultCache();

	NotionCore.PopulateMap.view(
		{ name: 'Board', type: 'board', id: 'view_1' } as any,
		{
			...default_nishan_arg,
			cache
		},
		view_map
	);

	expect(view_map.board.get('view_1')).not.toBeUndefined();
	expect(view_map.board.get('Board')).not.toBeUndefined();
});
