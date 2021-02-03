import { SyncRecordValuesResult, TCollectionBlock, TSchemaUnit } from '@nishans/types';
import axios from 'axios';

import { idToUuid, uuidToId } from './uuidConversion';

export type ISchemaMapValue = { schema_id: string } & TSchemaUnit;
export type ISchemaMap = Map<string, ISchemaMapValue>;

export function getCollectionBlock (token: string, cvp_id: string) {
	if (!token) throw new Error(`Empty token provided`);
	if (!cvp_id) throw new Error(`Empty id provided`);

	const id = idToUuid(uuidToId(cvp_id));
	const headers = {
		headers: {
			cookie: `token_v2=${token};`
		}
	};

	return axios.post<SyncRecordValuesResult>(
		`https://www.notion.so/api/v3/syncRecordValues`,
		{
			requests: [
				{
					table: 'block',
					id,
					version: 0
				}
			]
		},
		headers
	);
}

export async function generateSchemaMap (token: string, cvp_id: string) {
	const id = idToUuid(uuidToId(cvp_id));
	const headers = {
		headers: {
			cookie: `token_v2=${token};`
		}
	};

	const { data } = await axios.post<SyncRecordValuesResult>(
		`https://www.notion.so/api/v3/syncRecordValues`,
		{
			requests: [
				{
					table: 'block',
					id,
					version: 0
				}
			]
		},
		headers
	);

	const { collection_id } = data.recordMap.block[id].value as TCollectionBlock;

	const { data: { recordMap } } = await axios.post<SyncRecordValuesResult>(
		`https://www.notion.so/api/v3/syncRecordValues`,
		{
			requests: [
				{
					table: 'collection',
					id: collection_id,
					version: 0
				}
			]
		},
		headers
	);
	const { schema } = recordMap.collection[collection_id].value;
	const schema_map: ISchemaMap = new Map();
	Object.entries(schema).forEach(([ schema_id, value ]) => {
		schema_map.set(value.name, {
			schema_id,
			...value
		});
	});
	return schema_map;
}
