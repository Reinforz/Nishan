import { INotionOperationOptions, NotionOperations } from '@nishans/operations';
import { IUserPermission } from '@nishans/types';
import { v4 as uuidv4 } from 'uuid';
import { LocalFileStructure } from '../types';

/**
 * Writes extracted notion data to a remote notion block
 * @param result_data Extracted notion data
 * @param options Notion operations options
 */
export async function writeToNotion (result_data: LocalFileStructure, options: INotionOperationOptions) {
	const metadata = {
			alive: true,
			created_time: Date.now(),
			space_id: options.space_id,
			shard_id: options.shard_id,
			version: 0
		},
		created_edited_props = {
			created_by_id: options.user_id,
			created_by_table: 'notion_user',
			last_edited_time: Date.now(),
			last_edited_by_table: 'notion_user',
			last_edited_by_id: options.user_id
		};

	const editor_user_permission: IUserPermission = {
		role: 'editor',
		type: 'user_permission',
		user_id: options.user_id
	};

	const { views, collection, row_pages, template_pages } = result_data;

	const collection_block_id = uuidv4(),
		collection_id = uuidv4(),
		view_ids: string[] = [],
		template_page_ids: string[] = [];

	const collection_create_block_op = NotionOperations.Chunk.block.update(collection_block_id, [], {
		id: collection_block_id,
		type: 'collection_view_page',
		collection_id,
		view_ids,
		parent_id: options.space_id,
		parent_table: 'space',
		permissions: [ editor_user_permission ],
		...metadata,
		...created_edited_props
	});

	const row_pages_create_op = row_pages.map((row_page) => {
		const row_page_id = uuidv4();
		return NotionOperations.Chunk.block.update(row_page_id, [], {
			id: row_page_id,
			parent_id: collection_id,
			parent_table: 'collection',
			format: row_page.format,
			content: [],
			properties: row_page.properties,
			type: 'page',
			permissions: [ editor_user_permission ],
			...metadata,
			...created_edited_props
		});
	});

	const template_pages_create_op = template_pages.map((template_page) => {
		const template_page_id = uuidv4();
		template_page_ids.push(template_page_id);
		return NotionOperations.Chunk.block.update(template_page_id, [], {
			id: template_page_id,
			parent_id: collection_id,
			parent_table: 'collection',
			format: template_page.format,
			content: [],
			properties: template_page.properties,
			type: 'page',
			is_template: true,
			permissions: [ editor_user_permission ],
			...metadata,
			...created_edited_props
		});
	});

	const collection_create_op = NotionOperations.Chunk.collection.update(collection_id, [], {
		id: collection_id,
		parent_id: collection_block_id,
		parent_table: 'block',
		name: collection.name,
		icon: collection.icon,
		cover: collection.cover,
		schema: collection.schema,
		template_pages: template_page_ids,
		...metadata
	});

	const views_create_ops = views.map((view) => {
		const view_id = uuidv4();
		view_ids.push(view_id);

		return NotionOperations.Chunk.collection_view.update(view_id, [], {
			id: view_id,
			name: view.name,
			type: view.type,
			format: view.format,
			query2: view.query2,
			parent_table: 'block',
			parent_id: collection_block_id,
			...metadata
		});
	});

	const space_after_op = NotionOperations.Chunk.space.listAfter(options.space_id, [ 'pages' ], {
		after: '',
		id: collection_block_id
	});

	const operations = [
		collection_create_block_op,
		collection_create_op,
		...views_create_ops,
		...row_pages_create_op,
		...template_pages_create_op,
		space_after_op
	];

	await NotionOperations.executeOperations(operations, options);
}
