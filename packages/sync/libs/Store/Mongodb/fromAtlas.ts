import { readFromMongodb, storeInMongodb } from '../../utils';

/**
 * Stores data from remote atlas instance into local mongodb instance
 * @param connection_uri Connection uri of the remote atlas instance
 */
export async function storeInMongodbFromAtlas (local_connection_uri: string, remote_collection_uri: string) {
	await storeInMongodb(local_connection_uri, await readFromMongodb(remote_collection_uri));
}
