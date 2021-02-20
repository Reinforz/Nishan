import { CreateMaps } from '../../../libs';
import { IPageMap } from '../../../types';

const page_map_keys: (keyof IPageMap)[] = [ 'page', 'collection_view_page' ];

describe('CreateMaps.page', () => {
	const page_map = CreateMaps.page();
	it(`Should contain correct keys and value`, () => {
		page_map_keys.forEach((page_map_key) => expect(page_map[page_map_key] instanceof Map).toBe(true));
	});
});
