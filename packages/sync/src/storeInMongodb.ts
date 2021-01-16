import { readFromNotion, storeInMongodb, readFromFile, readFromMongodb } from '../utils';

/**
 * Stores data from notion collection block into local/remote mongodb instance
 * @param token Notion token
 * @param database_id Id of the notion collection block
 */
export async function storeInMongodbFromNotion (connection_uri: string, token: string, database_id: string) {
	await storeInMongodb(connection_uri, await readFromNotion(token, database_id));
}

/**
 * Stores data from local file from file system into local/remote mongodb instance
 * @param file_path Full path to the output file
 */
export async function storeInMongodbFromFile (connection_uri: string, file_path: string) {
	await storeInMongodb(connection_uri, await readFromFile(file_path));
}

/**
 * Stores data from remote atlas instance into local mongodb instance
 * @param connection_uri Connection uri of the remote atlas instance
 */
export async function storeInMongodbFromAtlas (local_connection_uri: string, remote_collection_uri: string) {
	await storeInMongodb(local_connection_uri, await readFromMongodb(remote_collection_uri));
}
