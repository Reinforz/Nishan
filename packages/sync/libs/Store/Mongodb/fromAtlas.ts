import { NotionSync } from '../../';

/**
 * Stores data from remote atlas instance into local mongodb instance
 * @param local_connection_uri Connection uri of the local mongodb instance
 * @param remote_connection_uri Connection uri of the remote atlas instance
 */
export async function storeInMongodbFromAtlas (local_connection_uri: string, remote_collection_uri: string) {
	await NotionSync.Write.toMongodb(local_connection_uri, await NotionSync.Read.fromMongodb(remote_collection_uri));
}
