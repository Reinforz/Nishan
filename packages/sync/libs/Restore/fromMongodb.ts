import { INotionOperationOptions } from '@nishans/operations';
import { readFromMongodb, storeInNotion } from '../utils';

/**
 * Restore notion from data stored in local or remote mongodb instance
 * @param token Notion token of the user
 * @param connection_uri Connection uri of the remote or local mongodb instance
 * @param space_cb A callback to get the space where the restoration will take place
 */
export async function notionSyncRestoreFromMongodb (connection_uri: string, options: INotionOperationOptions) {
	await storeInNotion(await readFromMongodb(connection_uri), options);
}
