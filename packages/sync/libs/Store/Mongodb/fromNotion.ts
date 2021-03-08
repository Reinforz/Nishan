import { INotionCacheOptions } from '@nishans/cache';
import { readFromNotion, storeInMongodb } from '../../utils';

/**
 * Stores data from notion collection block into local/remote mongodb instance
 * @param connection_uri Mongodb connection uri
 * @param database_id Id of the notion collection block
 * @param options Notion Cache options
 */
export async function storeInMongodbFromNotion (
	connection_uri: string,
	database_id: string,
	options: INotionCacheOptions
) {
	await storeInMongodb(connection_uri, await readFromNotion(database_id, options));
}
