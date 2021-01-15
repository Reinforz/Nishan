import axios from 'axios';
import { ICollection, SyncRecordValuesResult, TCollectionBlock, TView } from '@nishans/types';
import { MongoClient } from 'mongodb';

import { idToUuid } from '../utils';

export async function storeMongodb (token: string, database_id: string) {
	const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
	try {
		await client.connect();
		const headers = {
			headers: {
				cookie: `token_v2=${token};`
			}
		};
		database_id = idToUuid(database_id);
		const { data } = await axios.post<SyncRecordValuesResult>(
			'https://www.notion.so/api/v3/syncRecordValues',
			{
				requests: [
					{
						id: database_id,
						table: 'block',
						version: 0
					}
				]
			},
			headers
		);

		const block_data = data.recordMap.block[database_id].value as TCollectionBlock;
		const { collection_id, view_ids } = block_data;

		const { data: { recordMap } } = await axios.post<SyncRecordValuesResult>(
			'https://www.notion.so/api/v3/syncRecordValues',
			{
				requests: [
					{
						id: collection_id,
						table: 'collection',
						version: 0
					},
					...view_ids.map((view_id) => ({ id: view_id, table: 'collection_view', version: 0 }))
				]
			},
			headers
		);

		const collection_data = recordMap.collection[collection_id].value as ICollection;
		const views_data = Object.values(recordMap.collection_view).map(({ value }) => value) as TView[];

		const db = client.db(`${collection_data.name}`);
		const block_collection = await db.createCollection('block');
		const collection_collection = await db.createCollection('collection');
		const views_collection = await db.createCollection('views');

		await block_collection.insertOne({
			id: block_data.id,
			collection_id: block_data.collection_id,
			view_ids: block_data.view_ids
		});
		await collection_collection.insertOne({
			name: collection_data.name,
			icon: collection_data.icon,
			cover: collection_data.cover,
			id: collection_data.id,
			schema: collection_data.schema,
			parent_id: collection_data.parent_id
		});
		await views_collection.insertMany(
			views_data.map((view_data) => ({
				id: view_data.id,
				type: view_data.type,
				name: view_data.name,
				format: view_data.format,
				query2: view_data.query2,
				parent_id: view_data.parent_id
			}))
		);
	} finally {
		await client.close();
	}
}
