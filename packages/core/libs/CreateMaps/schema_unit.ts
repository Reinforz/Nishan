import { NotionConstants } from '@nishans/constants';
import { ISchemaUnitMap } from '../../types';

/**
 * Returns an object with keys representing all the schema_unit types, and values containing a map of objects representing those schema_unit types
 */
export function schema_unit () {
	const obj: ISchemaUnitMap = {} as any;
	NotionConstants.schema_unit_types().map((schema_unit_type) => (obj[schema_unit_type] = new Map()));
	return obj;
}
