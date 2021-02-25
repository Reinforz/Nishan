import { UnknownPropertyReferenceError } from '@nishans/errors';
import { ISchemaMap } from '@nishans/notion-formula';

export const getSchemaMapUnit = (schema_map: ISchemaMap, key: string, path: string[]) => {
	const schema_map_unit = schema_map.get(key);
	if (schema_map_unit) return schema_map_unit;
	else throw new UnknownPropertyReferenceError(key, path);
};
