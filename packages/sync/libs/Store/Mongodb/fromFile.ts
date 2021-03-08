import { NotionSync } from '../../';

/**
 * Stores data from local file from file system into local/remote mongodb instance
 * @param file_path Full path to the output file
 */
export async function storeInMongodbFromFile (connection_uri: string, file_path: string) {
	await NotionSync.Write.toMongodb(connection_uri, await NotionSync.Read.fromFile(file_path));
}
