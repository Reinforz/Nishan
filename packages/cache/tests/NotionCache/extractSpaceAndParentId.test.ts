import { NotionCache } from '../../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`parent_table=space`, () => {
	expect(NotionCache.extractSpaceAndParentId({ parent_table: 'space', parent_id: 'space_1' } as any)).toStrictEqual([
		[ 'space_1', 'space' ]
	]);
});

it(`parent_table=block`, () => {
	expect(
		NotionCache.extractSpaceAndParentId({
			parent_table: 'block',
			parent_id: 'block_1',
			space_id: 'space_1'
		} as any)
	).toStrictEqual([ [ 'block_1', 'block' ], [ 'space_1', 'space' ] ]);
});
