import { collection } from './collection';
import { createContents } from './Contents/contents';
import { createSchema } from './schema';
import { CreateSchemaUnitData } from './SchemaUnit';
import { createViews } from './views';

export const CreateData = {
	views: createViews,
	collection,
	contents: createContents,
	schema: createSchema,
	schema_unit: CreateSchemaUnitData
};
