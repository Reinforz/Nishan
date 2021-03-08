import { readFromMongodb, storeInFile } from '../../utils';

/**
 * Stores data from remote/local mongodb instance into a local file
 * @param connection_uri Connection uri of the local or remote mongodb instance
 * @param filepath full path of the output file
 */
export async function storeInFileFromMongodb (connection_uri: string, filepath: string) {
	await storeInFile(filepath, await readFromMongodb(connection_uri));
}
