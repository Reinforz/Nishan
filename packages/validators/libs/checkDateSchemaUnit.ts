import { NotionErrors } from '@nishans/errors';
import { TSchemaUnit } from '@nishans/types';

type ISchemaMapValue = {
	schema_id: string;
} & TSchemaUnit;

export function checkDateSchemaUnit (schema_map_unit: ISchemaMapValue, value: string, path: string[]) {
	if (
		!schema_map_unit.type.match(/^(last_edited_time|created_time|date|formula)$/) ||
		(schema_map_unit.type === 'formula' && schema_map_unit.formula.result_type !== 'date')
	)
		throw new NotionErrors.unsupported_property_type(value, path, schema_map_unit.type, [
			'last_edited_time',
			'created_time',
			'date',
			'formula'
		]);
}
