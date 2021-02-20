import { collection } from './collection';
import { contents } from './Contents/contents';
import { schema } from './schema';
import { CreateSchemaUnitData } from './SchemaUnit';
import { views } from './Views/views';

export const CreateData = {
	views,
	collection,
	contents,
	schema,
	schema_unit: CreateSchemaUnitData
};
