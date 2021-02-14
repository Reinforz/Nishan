import deepEqual from 'deep-equal';
import { detectChildData } from '../../src';

describe('detectChildData', () => {
	it(`Should return correct child data for space type`, () => {
		expect(deepEqual(detectChildData('space'), [ 'pages', 'block' ])).toBe(true);
	});

	it(`Should return correct child data for user_root type`, () => {
		expect(deepEqual(detectChildData('user_root'), [ 'space_views', 'space_view' ])).toBe(true);
	});

	it(`Should return correct child data for collection type`, () => {
		expect(deepEqual(detectChildData('collection'), [ 'template_pages', 'block' ])).toBe(true);
	});

	it(`Should return correct child data for space_view type`, () => {
		expect(deepEqual(detectChildData('space_view'), [ 'bookmarked_pages', 'block' ])).toBe(true);
	});

	it(`Should return correct child data for block type`, () => {
		expect(deepEqual(detectChildData('block', { type: 'page' } as any), [ 'content', 'block' ])).toBe(true);

		expect(
			deepEqual(detectChildData('block', { type: 'collection_view_page' } as any), [ 'view_ids', 'collection_view' ])
		).toBe(true);

		expect(
			deepEqual(detectChildData('block', { type: 'collection_view' } as any), [ 'view_ids', 'collection_view' ])
		).toBe(true);

		expect(() => detectChildData('block' as any)).toThrow(`type block requires second data argument`);
		expect(() => detectChildData('block', { type: 'header' } as any)).toThrow(`Unsupported block type header`);
		expect(() => detectChildData('notion_user' as any)).toThrow(`Unsupported notion_user data provided`);
	});
});
