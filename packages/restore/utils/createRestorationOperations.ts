import { IOperation, ISpace, LoadUserContentResult } from '@nishans/types';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

import { createTransaction, Operations } from './';
import { LocalFileStructure } from '../src/types';

export async function createRestorationOperations (
	token: string,
	space_cb: (space: ISpace) => boolean | undefined,
	result_data: LocalFileStructure
) {
	const headers = {
		headers: {
			cookie: `token_v2=${token};`,
			['x-notion-active-user-header']: ''
		}
	};

	const { data: { recordMap } } = await axios.post<LoadUserContentResult>(
		'https://www.notion.so/api/v3/loadUserContent',
		{},
		headers
	);
	const user_id = Object.keys(recordMap.notion_user)[0];
	headers.headers['x-notion-active-user-header'] = user_id;

	const space = Object.values(recordMap.space).find(({ value }) => space_cb(value));
	if (space) {
		const { id: space_id, shard_id } = space.value;
		const metadata = {
			alive: true,
			created_time: Date.now(),
			created_by_id: user_id,
			created_by_table: 'notion_user',
			last_edited_time: Date.now(),
			last_edited_by_table: 'notion_user',
			last_edited_by_id: user_id,
			space_id,
			shard_id,
			version: 0
		};
		const { views, collection, row_pages, template_pages } = result_data;
		const collection_block_id = uuidv4(),
			collection_id = uuidv4(),
			view_ids: string[] = [],
			template_page_ids: string[] = [];
		const collection_create_block_op = Operations.block.update(collection_block_id, [], {
			id: collection_block_id,
			type: 'collection_view_page',
			collection_id,
			view_ids,
			parent_id: space_id,
			parent_table: 'space',
			permissions: [
				{
					role: 'editor',
					type: 'user_permission',
					user_id
				}
			],
			...metadata
		});

		const row_pages_create_op = row_pages.map((row_page) => {
			const row_page_id = uuidv4(),
				properties = {} as any;
			Object.entries(row_page.properties).forEach(([ key, value ]) => (properties[key] = [ [ value ] ]));
			return Operations.block.update(row_page_id, [], {
				parent_id: collection_id,
				parent_table: 'collection',
				format: row_page.format,
				content: [],
				properties,
				type: 'page',
				permissions: [
					{
						role: 'editor',
						type: 'user_permission',
						user_id
					}
				],
				...metadata
			});
		});

		const template_pages_create_op = template_pages.map((template_page) => {
			const template_page_id = uuidv4(),
				properties = {} as any;
			template_page_ids.push(template_page_id);
			Object.entries(template_page.properties).forEach(([ key, value ]) => (properties[key] = [ [ value ] ]));
			return Operations.block.update(template_page_id, [], {
				parent_id: collection_id,
				parent_table: 'collection',
				format: template_page.format,
				content: [],
				properties,
				type: 'page',
				is_template: true,
				permissions: [
					{
						role: 'editor',
						type: 'user_permission',
						user_id
					}
				],
				...metadata
			});
		});

		const collection_create_op = Operations.collection.update(collection_id, [], {
			id: collection_id,
			parent_id: collection_block_id,
			parent_table: 'block',
			name: [ [ collection.name ] ],
			icon: collection.icon,
			cover: collection.cover,
			schema: collection.schema,
			template_pages: template_page_ids,
			...metadata
		});

		const views_create_ops = views.map((view) => {
			const view_id = uuidv4();
			view_ids.push(view_id);
			return Operations.collection_view.update(view_id, [], {
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

		const space_after_op = Operations.space.listAfter(space_id, [ 'pages' ], {
			after: '',
			id: collection_block_id
		});

		const operations: IOperation[] = [
			collection_create_block_op,
			collection_create_op,
			...views_create_ops,
			...row_pages_create_op,
			...template_pages_create_op,
			space_after_op
		];

		await axios.post(
			'https://www.notion.so/api/v3/saveTransactions',
			createTransaction(shard_id, space_id, operations),
			headers
		);
	} else throw new Error('The callback didnot return any space');
}
