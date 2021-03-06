import { createBlockTypesArray } from './blocks';
import { createDataTypesArray } from './data';
import { createOperationCommands } from './operation_commands';
import { createSchemaUnitTypesArray } from './schema_units';
import { createViewTypesArray } from './views';

export const NotionConstants = {
	block_types: createBlockTypesArray,
	view_types: createViewTypesArray,
	schema_unit_types: createSchemaUnitTypesArray,
	data_types: createDataTypesArray,
	operation_commands: createOperationCommands
};
