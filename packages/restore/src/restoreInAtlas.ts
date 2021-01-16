import { getMongodbData, readLocalFile, storeInMongodb } from '../utils';

/**
  * Stores notion data from local file to a remote atlas one
  * @param connection_uri Connection uri of the remote atlas cluster
  * @param filepath The absolute filepath of the local file
 */
export async function restoreAtlasFromLocalFile (connection_uri: string, filepath: string) {
	await storeInMongodb(connection_uri, await readLocalFile(filepath));
}

/**
 * Stores notion data from local mongodb instance to a remote atlas one
 * @param remote_connection_uri Connection uri of the remote atlas database
 * @param local_connection_uri Connection uri of the local mongodb instance
 */
export async function restoreAtlasFromMongodb (remote_connection_uri: string, local_connection_uri: string) {
	await storeInMongodb(remote_connection_uri, await getMongodbData(local_connection_uri));
}
