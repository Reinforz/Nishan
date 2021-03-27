import { populateBlockMap } from './populateBlockMap';
import { populateCollectionBlockMap } from './populateCollectionBlockMap';
import { populatePageMap } from './populatePageMap';
import { populateSchemaUnitMap } from './populateSchemaUnitMap';
import { populateViewMap } from './populateViewMap';

export const PopulateMap = {
	page: populatePageMap,
	view: populateViewMap,
	block: populateBlockMap,
	collectionBlock: populateCollectionBlockMap,
	schemaUnit: populateSchemaUnitMap
};
