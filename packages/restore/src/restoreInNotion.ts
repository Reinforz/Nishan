import path from 'path';
import fs from 'fs';
import { load } from 'js-yaml';

import { LocalFileStructure } from './types';
import { ISpace } from '@nishans/types';
import { createRestorationOperations } from './createRestorationOperations';
import { getLocalMongodbData } from '../utils';

export async function restoreNotionFromLocalMongodb (
	token: string,
	database_name: string,
	space_cb: (space: ISpace) => boolean | undefined
) {
	await createRestorationOperations(token, space_cb, await getLocalMongodbData(database_name));
}

export async function restoreNotionFromLocalFile (
	token: string,
	filepath: string,
	space_cb: (space: ISpace) => boolean | undefined
) {
	const ext = path.extname(filepath);
	let result_data: LocalFileStructure = {} as any;

	if (ext === '.json') result_data = JSON.parse(await fs.promises.readFile(filepath, 'utf-8'));
	else if (ext === '.yaml' || ext === '.yml')
		result_data = load(await fs.promises.readFile(filepath, 'utf-8')) as LocalFileStructure;
	else throw new Error('Unsupported file extension. Use either json or yaml file when speciying the filepath');

	await createRestorationOperations(token, space_cb, result_data);
}
