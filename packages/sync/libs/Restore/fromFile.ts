import { INotionOperationOptions } from '@nishans/operations';
import { NotionSync } from '../';

/**
 * Restore notion from data stored in local file
 * @param filepath Absolute file path of the local file
 * @param options Notion Operations Options
 */
export async function notionSyncRestoreFromFile (filepath: string, options: INotionOperationOptions) {
	await NotionSync.Write.toNotion(await NotionSync.Read.fromFile(filepath), options);
}
