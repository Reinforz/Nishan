import axios from 'axios';
import { ICollection, SyncRecordValuesResult, TCollectionBlock, TView } from '@nishans/types';
import fs from 'fs';

const idToUuid = (id = '') => {
	id = id.replace(/\-/g, '');
	return `${id.substr(0, 8)}-${id.substr(8, 4)}-${id.substr(12, 4)}-${id.substr(16, 4)}-${id.substr(20)}`;
};

export async function storeLocally (token: string, database_id: string, path: string) {
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

	const collection_block_data = data.recordMap.block[database_id].value as TCollectionBlock;
	const { collection_id, view_ids } = collection_block_data;

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

	const result_data = {
		collection_block: collection_block_data,
		collection: collection_data,
		views: views_data
	};

	await fs.promises.writeFile(path, JSON.stringify(result_data, null, 2), 'utf-8');
}
