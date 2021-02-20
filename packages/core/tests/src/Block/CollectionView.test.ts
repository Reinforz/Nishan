import { CollectionView } from '../../../src';
import { createDefaultCache } from '../../utils/createDefaultCache';
import { default_nishan_arg } from '../../utils/defaultNishanArg';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`getCachedParentData`, () => {
	const cache = {
		...createDefaultCache(),
		block: new Map([ [ 'block_1', { id: 'block_1' } ], [ 'block_2', { id: 'block_2', parent_id: 'block_1' } ] ])
	} as any;

	const collection_view = new CollectionView({
		...default_nishan_arg,
		cache,
		id: 'block_2'
	});

	const parent_data = collection_view.getCachedParentData();
	expect(parent_data).toStrictEqual({
		id: 'block_1'
	});
});
