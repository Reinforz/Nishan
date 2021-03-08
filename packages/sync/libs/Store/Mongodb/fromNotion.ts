import { INotionCacheOptions } from '@nishans/cache';
import { readFromNotion, storeInMongodb } from '../../utils';

/**
 * Stores data from notion collection block into local/remote mongodb instance
 * @param token Notion token
 * @param database_id Id of the notion collection block
 */
export async function storeInMongodbFromNotion (
	connection_uri: string,
	database_id: string,
	options: INotionCacheOptions
) {
	await storeInMongodb(connection_uri, await readFromNotion(database_id, options));
}
