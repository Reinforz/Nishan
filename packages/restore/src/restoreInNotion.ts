import path from 'path';
import fs from 'fs';
import { load } from 'js-yaml';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { LocalFileStructure } from './types';
import { IOperation, ISpace, LoadUserContentResult } from '@nishans/types';
import { Operations, createTransaction } from '../utils';

export async function restoreNotionFromLocalFile (
	token: string,
	filepath: string,
	space_cb: (space: ISpace) => boolean
) {
	const ext = path.extname(filepath);
	let result_data: LocalFileStructure = {} as any;

	if (ext === '.json') result_data = JSON.parse(await fs.promises.readFile(filepath, 'utf-8'));
	else if (ext === '.yaml' || ext === '.yml')
		result_data = load(await fs.promises.readFile(filepath, 'utf-8')) as LocalFileStructure;
	else throw new Error('Unsupported file extension. Use either json or yaml file when speciying the filepath');

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
		const { views, collection } = result_data;
		const collection_block_id = uuidv4(),
			collection_id = uuidv4(),
			view_ids: string[] = [];
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

		const collection_create_op = Operations.collection.update(collection_id, [], {
			id: collection_id,
			parent_id: collection_block_id,
			parent_table: 'block',
			name: [ [ collection.name ] ],
			icon: collection.icon,
			cover: collection.cover,
			schema: collection.schema,
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
			space_after_op
		];

		await axios.post(
			'https://www.notion.so/api/v3/saveTransactions',
			createTransaction(shard_id, space_id, operations),
			headers
		);
	} else throw new Error('The callback didnot return any space');
}
