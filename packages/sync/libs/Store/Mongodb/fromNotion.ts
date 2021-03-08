import { readFromNotion, storeInMongodb } from '../../utils';

/**
 * Stores data from notion collection block into local/remote mongodb instance
 * @param token Notion token
 * @param database_id Id of the notion collection block
 */
export async function storeInMongodbFromNotion (connection_uri: string, token: string, database_id: string) {
	await storeInMongodb(connection_uri, await readFromNotion(token, database_id));
}
