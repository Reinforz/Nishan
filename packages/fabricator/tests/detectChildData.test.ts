import { detectChildData } from '../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('detectChildData', () => {
	it(`Should return correct child data for space type`, () => {
		expect(detectChildData('space')).toStrictEqual([ 'pages', 'block' ]);
	});

	it(`Should return correct child data for user_root type`, () => {
		expect(detectChildData('user_root')).toStrictEqual([ 'space_views', 'space_view' ]);
	});

	it(`Should return correct child data for collection type`, () => {
		expect(detectChildData('collection')).toStrictEqual([ 'template_pages', 'block' ]);
	});

	it(`Should return correct child data for space_view type`, () => {
		expect(detectChildData('space_view')).toStrictEqual([ 'bookmarked_pages', 'block' ]);
	});

	it(`Should return correct child data for block type`, () => {
		describe('child_path=content', () => {
			[ 'page', 'column_list', 'column', 'factory' ].forEach((block_type) => {
				expect(detectChildData('block', { type: block_type } as any)).toStrictEqual([ 'content', 'block' ]);
			});
		});

		expect(detectChildData('block', { type: 'collection_view_page' } as any)).toStrictEqual([
			'view_ids',
			'collection_view'
		]);

		expect(detectChildData('block', { type: 'collection_view' } as any)).toStrictEqual([
			'view_ids',
			'collection_view'
		]);

		expect(() => detectChildData('block' as any)).toThrow(`type block requires second data argument`);
		expect(() => detectChildData('block', { type: 'header' } as any)).toThrow();
		expect(() => detectChildData('notion_user' as any)).toThrow();
	});
});
