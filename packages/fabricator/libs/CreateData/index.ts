import { collection } from './collection';
import { contents } from './Contents/contents';
import { schema } from './schema';
import { CreateSchemaUnit } from './SchemaUnit';
import { views } from './Views/views';

export const CreateData = {
	views,
	collection,
	contents,
	schema,
	schema_unit: CreateSchemaUnit
};

export * from '../../types';
