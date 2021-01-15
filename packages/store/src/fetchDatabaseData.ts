import axios from 'axios';
import { ICollection, SyncRecordValuesResult, TCollectionBlock, TView } from '@nishans/types';
import { idToUuid } from '../utils';

export async function fetchDatabaseData (token: string, database_id: string) {
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
	return [ block_data, collection_data, views_data ] as [TCollectionBlock, ICollection, TView[]];
}
