import { createCollection } from './collection';
import { createContents } from './contents';
import { createSchema } from './schema';
import { createViews } from './views';

export const CreateData = {
	views: createViews,
	collection: createCollection,
	contents: createContents,
	schema: createSchema
};
