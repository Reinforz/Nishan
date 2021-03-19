import { NotionErrors } from '@nishans/errors';
import { TSchemaUnit } from '@nishans/types';

export const checkSelectSchemaUnit = (schema_map_unit: { schema_id: string } & TSchemaUnit, path: string[]) => {
	if (schema_map_unit.type !== 'select' && schema_map_unit.type !== 'multi_select')
		throw new NotionErrors.unsupported_property_type(schema_map_unit.name, path, schema_map_unit.type, [
			'select',
			'multi_select'
		]);
};
