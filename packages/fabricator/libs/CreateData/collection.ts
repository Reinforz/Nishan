import { NotionIdz } from '@nishans/idz';
import { NotionInit } from '@nishans/init';
import { NotionLogger } from '@nishans/logger';
import { NotionOperations } from '@nishans/operations';
import { IOperation, TView } from '@nishans/types';
import { NotionUtils } from '@nishans/utils';
import { ICollectionBlockInput, INotionFabricatorOptions } from '../';
import { CreateData } from './';

/**
 * Creates a collection from the input
 * @param input collection input
 * @param parent_id parent id of the collection 
 * @param options Data used to store to cache, ops stack, send request to get data
 * @returns a tuple of the collection_id, the generated view ids and the generated view map
 */
export async function collection (input: ICollectionBlockInput, parent_id: string, options: Omit<INotionFabricatorOptions, "cache_init_tracker">, cb?: ((data: TView)=>any)) {
	// Generate the collection id
	const operations: IOperation[] = [], collection_id = NotionIdz.Generate.id(input.collection_id);
	// Generate the schema to store in the collection
	const [ schema, ,format ] = await CreateData.schema(input.schema, {
		parent_collection_id: collection_id,
		name: input.name,
	}, options);

  NotionUtils.setDefault(input, {
    cover: '',
    icon: '',
    page_section_visibility: { backlinks: 'section_show', comments: "section_show" }
  });

  format.page_section_visibility = input.page_section_visibility;

	// construct the collection to store it in cache and in op stack
	const collection_data = NotionInit.collection({
		id: collection_id,
		schema,
		cover: input.cover,
		icon: input.icon,
		parent_id,
		name: input.name,
    format
	});

	// Push the collection create operation to stack
  operations.push(NotionOperations.Chunk.collection.update(collection_id, [], JSON.parse(JSON.stringify(collection_data))));
  // Create the views of the collection
	const [views_data, view_operations] = await CreateData.views(collection_data, input.views, options, parent_id, cb);
  operations.push(...view_operations);
	// Store the collection in cache
	options.cache.collection.set(collection_id, collection_data);
	// Log the collection creation
	options.logger && NotionLogger.method.info(`CREATE collection ${collection_id}`);

	return [ collection_data, views_data, operations ] as const;
}
