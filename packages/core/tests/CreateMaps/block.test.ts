import { NotionConstants } from '@nishans/constants';
import { CreateMaps } from '../../libs';

const block_map = CreateMaps.block();

it(`Should contain correct keys and value`, () => {
	NotionConstants.blockTypes().forEach((block_map_key) => expect(block_map[block_map_key] instanceof Map).toBe(true));
});
