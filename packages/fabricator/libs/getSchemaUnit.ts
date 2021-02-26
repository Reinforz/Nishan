import { UnknownPropertyReferenceError } from '@nishans/errors';
import { Schema } from '@nishans/types';

export const getSchemaUnit = (schema: Schema, name: string, path: string[]) => {
	const schema_unit = schema[name];
	if (schema_unit) return schema_unit;
	else throw new UnknownPropertyReferenceError(name, path);
};
