import { NotionConstants } from '@nishans/constants';
import { NotionCore } from '../../libs';

const view_map = NotionCore.CreateMaps.view();

it(`Should contain correct keys and value`, () => {
	NotionConstants.viewTypes().forEach((view_map_key) => expect(view_map[view_map_key] instanceof Map).toBe(true));
});
