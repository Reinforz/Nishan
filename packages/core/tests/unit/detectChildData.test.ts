import deepEqual from 'deep-equal';
import { detectChildData } from '../../src';
import data from '../data';

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
		expect(
			deepEqual(detectChildData('block', data.recordMap.block['6eae77bf-64cd-4ed0-adfb-e97d928a6402'].value), [
				'content',
				'block'
			])
		).toBe(true);

		expect(
			deepEqual(detectChildData('block', data.recordMap.block['4b4bb21d-f68b-4113-b342-830687a5337a'].value), [
				'view_ids',
				'collection_view'
			])
		).toBe(true);

		expect(
			deepEqual(detectChildData('block', data.recordMap.block['4b4bb21d-f68b-4113-b342-830687a5337b'].value), [
				'view_ids',
				'collection_view'
			])
		).toBe(true);

		expect(() => detectChildData('block' as any)).toThrow(`type block requires second data argument`);
		expect(() => detectChildData('block', data.recordMap.block['6eae77bf-64cd-4ed0-adfb-e97d928a6401'].value)).toThrow(
			`Unsupported block type header`
		);
		expect(() => detectChildData('notion_user' as any)).toThrow(`Unsupported notion_user data provided`);
	});
});
