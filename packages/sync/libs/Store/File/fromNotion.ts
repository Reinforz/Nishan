import { INotionCacheOptions } from '@nishans/cache';
import { NotionSync } from '../../';

/**
 * Stores data from notion collection block into a local file
 * @param database_id Id of the notion collection block
 * @param filepath full path of the output file
 * @param options Notion Cache options
 */
export async function storeInFileFromNotion (database_id: string, filepath: string, options: INotionCacheOptions) {
	await NotionSync.Write.toFile(filepath, await NotionSync.Read.fromNotion(database_id, options));
}
