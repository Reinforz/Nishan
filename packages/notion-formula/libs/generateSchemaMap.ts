import { NotionQueries } from '@nishans/endpoints';
import { idToUuid, uuidToId } from '@nishans/idz';
import { Schema, TCollectionBlock } from '@nishans/types';
import { ISchemaMap } from '../types';

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
		{ recordMap: { block } } = await NotionQueries.syncRecordValues(
			{
				requests: [
					{
						table: 'block',
						id,
						version: 0
					}
				]
			},
			{
				token,
				interval: 0
			}
		),
		{ collection_id } = block[id].value as TCollectionBlock,
		{ recordMap: { collection } } = await NotionQueries.syncRecordValues(
			{
				requests: [
					{
						table: 'collection',
						id: collection_id,
						version: 0
					}
				]
			},
			{
				token,
				interval: 0
			}
		),
		{ schema } = collection[collection_id].value;

	return generateSchemaMapFromCollectionSchema(schema);
}
