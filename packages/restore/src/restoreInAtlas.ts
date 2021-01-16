import { load } from 'js-yaml';
import path from 'path';
import fs from 'fs';

import { LocalFileStructure } from './types';
import { getLocalMongodbData, storeInMongodb } from '../utils';

export async function restoreAtlasFromLocalFile (connection_uri: string, filepath: string) {
	const ext = path.extname(filepath);
	let result_data: LocalFileStructure = {} as any;

	if (ext === '.json') result_data = JSON.parse(await fs.promises.readFile(filepath, 'utf-8'));
	else if (ext === '.yaml' || ext === '.yml')
		result_data = load(await fs.promises.readFile(filepath, 'utf-8')) as LocalFileStructure;
	else throw new Error('Unsupported file extension. Use either json or yaml file when speciying the filepath');

	storeInMongodb(connection_uri, result_data);
}

export async function restoreAtlasFromLocalMongodb (connection_uri: string, database_name: string) {
	await storeInMongodb(connection_uri, await getLocalMongodbData(database_name));
}
