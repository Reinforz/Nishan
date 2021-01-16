import { fetchDatabaseData } from './fetchDatabaseData';

import { storeInMongodb, readFromFile } from '../utils';

/**
 * Stores data from notion collection block into local mongodb instance
 * @param token Notion token
 * @param database_id Id of the notion collection block
 */
export async function storeInLocalMongodbFromNotion (token: string, database_id: string) {
	await storeInMongodb(await fetchDatabaseData(token, database_id));
}

/**
 * Stores data from local file from file system into local mongodb instance
 * @param file_path Full path to the output file
 */
export async function storeInLocalMongodbFromFile (file_path: string) {
	await storeInMongodb(await readFromFile(file_path));
}
