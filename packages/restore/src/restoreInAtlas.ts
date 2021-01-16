import { getMongodbData, readLocalFile, storeInMongodb } from '../utils';

export async function restoreAtlasFromLocalFile (connection_uri: string, filepath: string) {
	await storeInMongodb(connection_uri, await readLocalFile(filepath));
}

export async function restoreAtlasFromMongodb (remote_connection_uri: string, local_connection_uri: string) {
	await storeInMongodb(remote_connection_uri, await getMongodbData(local_connection_uri));
}
