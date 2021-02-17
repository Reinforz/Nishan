import { CollectionViewPage } from '../../../src';
import { createDefaultCache } from '../../createDefaultCache';
import { default_nishan_arg } from '../../defaultNishanArg';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`getCachedParentData`, () => {
	const cache = {
		...createDefaultCache(),
		block: new Map([
			[ 'block_1', { id: 'block_1' } ],
			[ 'block_2', { id: 'block_2', parent_id: 'block_1', parent_table: 'block' } ]
		])
	} as any;

	const collection_view_page = new CollectionViewPage({
		...default_nishan_arg,
		cache,
		id: 'block_2'
	});

	const parent_data = collection_view_page.getCachedParentData();
	expect(parent_data).toStrictEqual({
		id: 'block_1'
	});
});
