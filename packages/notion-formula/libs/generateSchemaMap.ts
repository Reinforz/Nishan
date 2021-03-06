import { NotionEndpoints } from '@nishans/endpoints';
import { idToUuid, uuidToId } from '@nishans/idz';
import { TCollectionBlock } from '@nishans/types';
import { NotionUtils } from '@nishans/utils';

/**
 * Generates a schema_map from a remote collection schema
 * @param token The token used to verify in notion
 * @param cb_id Id of the collection block
 * @returns The generated schema_map from the remote collection schema
 */
export async function generateSchemaMap (token: string, cb_id: string) {
	const id = idToUuid(uuidToId(cb_id)),
		{ recordMap: { block } } = await NotionEndpoints.Queries.syncRecordValues(
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
		{ recordMap: { collection } } = await NotionEndpoints.Queries.syncRecordValues(
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

	return NotionUtils.generateSchemaMap(schema);
}
