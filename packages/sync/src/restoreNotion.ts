import { ISpace } from '@nishans/types';

import { createRestorationOperations, readFromFile, readFromMongodb } from '../utils';

/**
 * Restore notion from data stored in local or remote mongodb instance
 * @param token Notion token of the user
 * @param connection_uri Connection uri of the remote or local mongodb instance
 * @param space_cb A callback to get the space where the restoration will take place
 */
export async function restoreNotionFromMongodb (
	token: string,
	connection_uri: string,
	space_cb: (space: ISpace) => any
) {
	await createRestorationOperations(token, space_cb, await readFromMongodb(connection_uri));
}

/**
 * Restore notion from data stored in local file
 * @param token Notion token of the user
 * @param filepath Absolute file path of the local file
 * @param space_cb A callback to get the space where the restoration will take place
 */
export async function restoreNotionFromLocalFile (token: string, filepath: string, space_cb: (space: ISpace) => any) {
	await createRestorationOperations(token, space_cb, await readFromFile(filepath));
}
