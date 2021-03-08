import { readFromNotion, storeInFile } from '../../utils';

/**
 * Stores data from notion collection block into a local file
 * @param token Notion token
 * @param database_id Id of the notion collection block
 * @param filepath full path of the output file
 */
export async function storeInFileFromNotion (token: string, database_id: string, filepath: string) {
	await storeInFile(filepath, await readFromNotion(token, database_id));
}
