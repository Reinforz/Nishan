import { INotionOperationOptions } from '@nishans/operations';
import { NotionSync } from '../';

/**
 * Restore notion from data stored in local or remote mongodb instance
 * @param connection_uri Connection uri of the remote or local mongodb instance
 * @param options Notion Operations Options
 */
export async function notionSyncRestoreFromMongodb (connection_uri: string, options: INotionOperationOptions) {
	await NotionSync.Write.toNotion(await NotionSync.Read.fromMongodb(connection_uri), options);
}
