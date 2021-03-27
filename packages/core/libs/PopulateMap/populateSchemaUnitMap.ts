import { INotionFabricatorOptions } from '@nishans/fabricator';
import { TSchemaUnit } from '@nishans/types';
import { SchemaUnit } from '..';
import { ISchemaUnitMap } from '../../types';

export const populateSchemaUnitMap = (
	id: string,
	schema_id: string,
	schema_unit: TSchemaUnit,
	options: INotionFabricatorOptions,
	schema_unit_map: ISchemaUnitMap
) => {
	const schema_unit_obj = new SchemaUnit({
		id,
		...options,
		schema_id
	});
	schema_unit_map[schema_unit.type].set(schema_id, schema_unit_obj);
	schema_unit_map[schema_unit.type].set(schema_unit.name, schema_unit_obj);
};
