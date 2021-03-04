import { NotionConstants } from '@nishans/constants';
import { CreateMaps } from '../../libs';

const block_map = CreateMaps.block();

it(`Should contain correct keys and value`, () => {
	NotionConstants.block_types().forEach((block_map_key) => expect(block_map[block_map_key] instanceof Map).toBe(true));
});
