import { IViewMap } from '../../../types';
import { CreateMaps } from '../../../utils';

const view_map_keys: (keyof IViewMap)[] = [ 'board', 'gallery', 'list', 'timeline', 'table', 'calendar' ];

describe('createViewMap', () => {
	const view_map = CreateMaps.view();

	it(`Should contain correct keys and value`, () => {
		view_map_keys.forEach((view_map_key) => expect(view_map[view_map_key] instanceof Map).toBe(true));
	});
});
