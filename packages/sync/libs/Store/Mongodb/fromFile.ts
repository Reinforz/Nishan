import { readFromFile, storeInMongodb } from '../../utils';

/**
 * Stores data from local file from file system into local/remote mongodb instance
 * @param file_path Full path to the output file
 */
export async function storeInMongodbFromFile (connection_uri: string, file_path: string) {
	await storeInMongodb(connection_uri, await readFromFile(file_path));
}
