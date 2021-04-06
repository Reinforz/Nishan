import { NotionCache } from '@nishans/cache';
import { NotionCore } from '../../libs';
import { default_nishan_arg } from '../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it('NotionCore.PopulateMap.schemaUnit', () => {
	const schema_unit_map = NotionCore.CreateMaps.schemaUnit();

	const cache = NotionCache.createDefaultCache();

	NotionCore.PopulateMap.schemaUnit(
		'collection_1',
		'title',
		{ name: 'Title', type: 'title' },
		{
			...default_nishan_arg,
			cache
		},
		schema_unit_map
	);

	expect(schema_unit_map.title.get('title')).not.toBeUndefined();
	expect(schema_unit_map.title.get('Title')).not.toBeUndefined();
});
