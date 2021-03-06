import { NotionFabricator } from '../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`Should return correct child data for space type`, () => {
	expect(NotionFabricator.detectChildData('space')).toStrictEqual([ 'pages', 'block' ]);
});

it(`Should return correct child data for user_root type`, () => {
	expect(NotionFabricator.detectChildData('user_root')).toStrictEqual([ 'space_views', 'space_view' ]);
});

it(`Should return correct child data for collection type`, () => {
	expect(NotionFabricator.detectChildData('collection')).toStrictEqual([ 'template_pages', 'block' ]);
});

it(`Should return correct child data for space_view type`, () => {
	expect(NotionFabricator.detectChildData('space_view')).toStrictEqual([ 'bookmarked_pages', 'block' ]);
});

it(`Should return correct child data for block type`, () => {
	describe('child_path=content', () => {
		[ 'page', 'column_list', 'column', 'factory' ].forEach((block_type) => {
			expect(NotionFabricator.detectChildData('block', { type: block_type } as any)).toStrictEqual([
				'content',
				'block'
			]);
		});
	});

	describe('child_path=view_ids', () => {
		[ 'collection_view_page', 'collection_view' ].forEach((block_type) => {
			expect(NotionFabricator.detectChildData('block', { type: block_type } as any)).toStrictEqual([
				'view_ids',
				'collection_view'
			]);
		});
	});
});

describe('Should throw error', () => {
	expect(() => NotionFabricator.detectChildData('block' as any)).toThrow(`type block requires second data argument`);
	expect(() => NotionFabricator.detectChildData('block', { type: 'header' } as any)).toThrow();
	expect(() => NotionFabricator.detectChildData('notion_user' as any)).toThrow();
});
