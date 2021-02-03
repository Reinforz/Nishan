import { SyncRecordValuesResult, TCollectionBlock, TSchemaUnit } from '@nishans/types';
import axios from 'axios';

import { idToUuid, uuidToId } from './uuidConversion';

export type ISchemaMapValue = { schema_id: string } & TSchemaUnit;
export type ISchemaMap = Map<string, ISchemaMapValue>;

export function constructHeaders (token: string) {
	if (!token) throw new Error(`Empty token provided`);
	return {
		headers: {
			cookie: `token_v2=${token};`
		}
	};
}

export function getCollectionBlock (token: string, cvp_id: string) {
	const headers = constructHeaders(token);

	if (!cvp_id) throw new Error(`Empty id provided`);

	const id = idToUuid(uuidToId(cvp_id));

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

export function getCollection (token: string, collection_id: string) {
	const headers = constructHeaders(token);

	if (!collection_id) throw new Error(`Empty id provided`);

	return axios.post<SyncRecordValuesResult>(
		`https://www.notion.so/api/v3/syncRecordValues`,
		{
			requests: [
				{
					table: 'collection',
					id: idToUuid(uuidToId(collection_id)),
					version: 0
				}
			]
		},
		headers
	);
}

export async function generateSchemaMap (token: string, cvp_id: string) {
	const id = idToUuid(uuidToId(cvp_id));

	const { data } = await getCollectionBlock(token, cvp_id);

	const { collection_id } = data.recordMap.block[id].value as TCollectionBlock;

	const { data: { recordMap } } = await getCollection(token, collection_id);

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
