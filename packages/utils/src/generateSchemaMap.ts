import { Schema, SyncRecordValuesResult, TCollectionBlock, TSchemaUnit } from '@nishans/types';
import axios from 'axios';

import { idToUuid, uuidToId } from './uuidConversion';

export type ISchemaMapValue = { schema_id: string } & TSchemaUnit;
export type ISchemaMap = Map<string, ISchemaMapValue>;

/**
 * Construct a header suited to be used in notion api request
 * @param token The token used to inject into the header cookie
 * @returns A header object with cookie set using the passed token string
 */
export function constructHeaders (token: string) {
	// Throw an error if the token was not provided
	if (!token) throw new Error(`Empty token provided`);
	// return the constructed header object with the cookie key set using the passed token
	return {
		headers: {
			cookie: `token_v2=${token};`
		}
	};
}

/**
 * Get a remote collection block data
 * @param token The token used to verify in notion
 * @param cb_id Id of the collection block
 * @returns remote collection block data
 */
export function getCollectionBlock (token: string, cb_id: string) {
	const headers = constructHeaders(token);

	if (!cb_id) throw new Error(`Empty id provided`);

	// Convert the passed id to id, cuz it might be invalid, then transform it to uuid
	const id = idToUuid(uuidToId(cb_id));

	// Sent a post api request to notion's server to get the collection block only
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

/**
 * Get a remote collection data
 * @param token The token used to verify in notion
 * @param collection_id Id of the collection
 * @returns remote collection data
 */
export function getCollection (token: string, collection_id: string) {
	const headers = constructHeaders(token);

	if (!collection_id) throw new Error(`Empty id provided`);

	// Sent a post api request to notion's server to get the collection only
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

/**
 * Generates a schema_map from the passed schema
 * @param schema The collection schema used to generate the schema_map
 * @returns The generated schema map
 */
export function generateSchemaMapFromCollectionSchema (schema: Schema) {
	const schema_map: ISchemaMap = new Map();
	// Map through each key of the passed schema and use its name property to act as a key to the map
	Object.entries(schema).forEach(([ schema_id, value ]) => {
		schema_map.set(value.name, {
			schema_id,
			...value
		});
	});
	return schema_map;
}

/**
 * Generates a schema_map from a remote collection schema
 * @param token The token used to verify in notion
 * @param cb_id Id of the collection block
 * @returns The generated schema_map from the remote collection schema
 */
export async function generateSchemaMap (token: string, cb_id: string) {
	const id = idToUuid(uuidToId(cb_id)),
		{ data } = await getCollectionBlock(token, cb_id),
		{ collection_id } = data.recordMap.block[id].value as TCollectionBlock,
		{ data: { recordMap } } = await getCollection(token, collection_id),
		{ schema } = recordMap.collection[collection_id].value;

	return generateSchemaMapFromCollectionSchema(schema);
}
