import { populateBlockMap } from './populateBlockMap';
import { populateCollectionBlockMap } from './populateCollectionBlockMap';
import { populatePageMap } from './populatePageMap';

export const PopulateMap = {
	page: populatePageMap,
	block: populateBlockMap,
	collectionBlock: populateCollectionBlockMap
};
