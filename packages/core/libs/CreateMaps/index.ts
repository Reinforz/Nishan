import { createBlockMap } from './createBlockMap';
import { createPageMap } from './createPageMap';
import { createSchemaUnitMap } from './createSchemaUnitMap';
import { createViewMap } from './createViewMap';

export const CreateMaps = {
	block: createBlockMap,
	view: createViewMap,
	schemaUnit: createSchemaUnitMap,
	page: createPageMap
};
