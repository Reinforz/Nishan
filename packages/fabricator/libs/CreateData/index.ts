import { collection } from './collection';
import { contents } from './contents';
import { schema } from './schema';
import { CreateSchemaUnit } from './SchemaUnit';
import { views } from './views';

export const CreateData = {
	views,
	collection,
	contents,
	schema,
	SchemaUnit: CreateSchemaUnit
};
