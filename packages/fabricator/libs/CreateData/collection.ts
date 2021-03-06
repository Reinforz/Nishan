import { generateId } from '@nishans/idz';
import { NotionOperations } from '@nishans/operations';
import { ICollection, TView } from '@nishans/types';
import { NotionUtils } from '@nishans/utils';
import { CreateData, ICollectionBlockInput, INotionFabricatorOptions } from './';

/**
 * Creates a collection from the input
 * @param input collection input
 * @param parent_id parent id of the collection 
 * @param options Data used to store to cache, ops stack, send request to get data
 * @returns a tuple of the collection_id, the generated view ids and the generated view map
 */
export async function collection (input: ICollectionBlockInput, parent_id: string, options: INotionFabricatorOptions, cb?: ((data: TView)=>any)) {
	// Generate the collection id
	const collection_id = generateId(input.collection_id);
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
	const collection_data: ICollection = {
		id: collection_id,
		schema,
		cover: input.cover,
		icon: input.icon,
		parent_id,
		parent_table: 'block',
		alive: true,
		name: input.name,
		migrated: false,
		version: 0,
    format
	};

	// Push the collection create operation to stack
  await NotionOperations.executeOperations([NotionOperations.Chunk.collection.update(collection_id, [], JSON.parse(JSON.stringify(collection_data)))], options);
  // Create the views of the collection
	const views_data = await CreateData.views(collection_data, input.views, options, parent_id, cb);
	// Store the collection in cache
	options.cache.collection.set(collection_id, collection_data);
	// Log the collection creation
	options.logger && options.logger('CREATE', 'collection', collection_id);

	return [ collection_data, views_data ] as const;
}
