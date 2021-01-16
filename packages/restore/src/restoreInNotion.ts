import { ISpace } from '@nishans/types';

import { createRestorationOperations } from './createRestorationOperations';
import { getMongodbData, readLocalFile } from '../utils';

export async function restoreNotionFromMongodb (
	token: string,
	connection_uri: string,
	space_cb: (space: ISpace) => boolean | undefined
) {
	await createRestorationOperations(token, space_cb, await getMongodbData(connection_uri));
}

export async function restoreNotionFromLocalFile (
	token: string,
	filepath: string,
	space_cb: (space: ISpace) => boolean | undefined
) {
	await createRestorationOperations(token, space_cb, await readLocalFile(filepath));
}
