import { populateBlockMap } from './populateBlockMap';
import { populateCollectionBlockMap } from './populateCollectionBlockMap';
import { populatePageMap } from './populatePageMap';
import { populateSchemaUnitMap } from './populateSchemaUnitMap';

export const PopulateMap = {
	page: populatePageMap,
	block: populateBlockMap,
	collectionBlock: populateCollectionBlockMap,
	schemaUnit: populateSchemaUnitMap
};
