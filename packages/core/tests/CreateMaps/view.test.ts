import { NotionConstants } from '@nishans/constants';
import { CreateMaps } from '../../libs';

const view_map = CreateMaps.view();

it(`Should contain correct keys and value`, () => {
	NotionConstants.viewTypes().forEach((view_map_key) => expect(view_map[view_map_key] instanceof Map).toBe(true));
});
