import { fetchDatabaseData, storeInFile, readFromMongodb } from '../utils';

/**
 * Stores data from notion collection block into a local file
 * @param token Notion token
 * @param database_id Id of the notion collection block
 * @param filepath full path of the output file
 */
export async function storeInLocalFileFromNotion (token: string, database_id: string, filepath: string) {
	await storeInFile(filepath, await fetchDatabaseData(token, database_id));
}

/**
 * Stores data from local mongodb instance into a local file
 * @param connection_uri Connection uri of the local or remote mongodb instance
 * @param filepath full path of the output file
 */
export async function storeInLocalFileFromMongodb (connection_uri: string, filepath: string) {
	await storeInFile(filepath, await readFromMongodb(connection_uri));
}
