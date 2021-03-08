import { INotionOperationOptions } from '@nishans/operations';
import { readFromFile, storeInNotion } from '../utils';

/**
 * Restore notion from data stored in local file
 * @param token Notion token of the user
 * @param filepath Absolute file path of the local file
 * @param space_cb A callback to get the space where the restoration will take place
 */
export async function notionSyncRestoreFromFile (filepath: string, options: INotionOperationOptions) {
	await storeInNotion(await readFromFile(filepath), options);
}
