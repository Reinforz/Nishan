import { NotionCache } from '@nishans/cache';
import { CreateMaps, PopulateMap } from '../../libs';
import { default_nishan_arg } from '../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it('PopulateMap.schemaUnit', () => {
	const schema_unit_map = CreateMaps.schema_unit();

	const cache = NotionCache.createDefaultCache();

	PopulateMap.schemaUnit(
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
