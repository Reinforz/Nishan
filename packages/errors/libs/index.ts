import { ChildIndexOutOfBound } from './ChildIndexOutOfBound';
import { NotionErrorsLogs } from './Log';
import { NonExistentData } from './NonExistentData';
import { NonExistentSchemaUnitType } from './NonExistentSchemaUnitType';
import { PreExistentValue } from './PreExistentValue';
import { SchemaDuplicatePropertyName } from './SchemaDuplicatePropertyName';
import { UnknownPropertyReference } from './UnknownPropertyReference';
import { UnsupportedBlockType } from './UnsupportedBlockType';
import { UnsupportedDataType } from './UnsupportedDataType';
import { UnsupportedPropertyType } from './UnsupportedPropertyType';

export const NotionErrors = {
	child_index_out_of_bound: ChildIndexOutOfBound,
	non_existent_data: NonExistentData,
	non_existent_schema_unit_type: NonExistentSchemaUnitType,
	pre_existent_value: PreExistentValue,
	schema_duplicate_property_name: SchemaDuplicatePropertyName,
	unknown_property_reference: UnknownPropertyReference,
	unsupported_block_type: UnsupportedBlockType,
	unsupported_data_type: UnsupportedDataType,
	unsupported_property_type: UnsupportedPropertyType,
	Log: NotionErrorsLogs
};
