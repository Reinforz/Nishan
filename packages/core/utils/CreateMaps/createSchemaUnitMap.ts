import { ISchemaUnitMap } from '../../types';

/**
 * Returns an object with keys representing all the schema_unit types, and values containing a map of objects representing those schema_unit types
 */
export function createSchemaUnitMap () {
	return {
		text: new Map(),
		number: new Map(),
		select: new Map(),
		multi_select: new Map(),
		title: new Map(),
		date: new Map(),
		person: new Map(),
		file: new Map(),
		checkbox: new Map(),
		url: new Map(),
		email: new Map(),
		phone_number: new Map(),
		formula: new Map(),
		relation: new Map(),
		rollup: new Map(),
		created_time: new Map(),
		created_by: new Map(),
		last_edited_time: new Map(),
		last_edited_by: new Map()
	} as ISchemaUnitMap;
}
