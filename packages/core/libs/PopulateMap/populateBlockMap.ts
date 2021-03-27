import { INotionFabricatorOptions } from '@nishans/fabricator';
import { TBlock, TTextFormat } from '@nishans/types';
import { NotionUtils } from '@nishans/utils';
import { IBlockMap } from '../../types';
import { createBlockClass } from '../createBlockClass';
import { PopulateMap } from './';


/**
 * Generates block object and attaches them to corresponding key of the block map using name and id of the block as key
 * @param block block object
 * @param block_map Block map to populate
 * @param options Props passed to the block classes
 */
export async function populateBlockMap (block: TBlock, block_map: IBlockMap, options: INotionFabricatorOptions) {
	if (block.type === 'page' || block.type === 'collection_view_page') await PopulateMap.page(block, block_map, options);
	else if (block.type === 'collection_view') await PopulateMap.collectionBlock(block, options, block_map);
	else {
		const block_obj = createBlockClass(block.type, block.id, options);
		block_map[block.type].set(block.id, block_obj);
		const title = (block as any).properties?.title as TTextFormat;
		if (title) block_map[block.type].set(NotionUtils.extractInlineBlockContent(title), block_obj);
	}
}