import { INotionCacheOptions } from '@nishans/cache';
import { readFromNotion, storeInFile } from '../../utils';

/**
 * Stores data from notion collection block into a local file
 * @param token Notion token
 * @param database_id Id of the notion collection block
 * @param filepath full path of the output file
 */
export async function storeInFileFromNotion (database_id: string, filepath: string, options: INotionCacheOptions) {
	await storeInFile(filepath, await readFromNotion(database_id, options));
}
