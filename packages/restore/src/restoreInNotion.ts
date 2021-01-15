import path from 'path';
import fs from 'fs';
import { load } from 'js-yaml';
import axios from 'axios';

import { LocalFileStructure } from './types';
import { ISpace, LoadUserContentResult } from '@nishans/types';
import { Operations, createTransaction } from '../utils';

export async function restoreNotionFromLocalFile (
	token: string,
	filepath: string,
	space_cb: (space: ISpace) => boolean
) {
	const ext = path.extname(filepath);
	let result_data: LocalFileStructure = {} as any;

	if (ext === '.json') result_data = JSON.parse(await fs.promises.readFile(filepath, 'utf-8'));
	else if (ext === '.yaml' || ext === '.yml')
		result_data = load(await fs.promises.readFile(filepath, 'utf-8')) as LocalFileStructure;
	else throw new Error('Unsupported file extension. Use either json or yaml file when speciying the filepath');

	const headers = {
		headers: {
			cookie: `token_v2=${token};`,
			['x-notion-active-user-header']: ''
		}
	};

	const { data: { recordMap } } = await axios.post<LoadUserContentResult>(
		'https://www.notion.so/api/v3/loadUserContent',
		{},
		headers
	);

	headers.headers['x-notion-active-user-header'] = Object.keys(recordMap.notion_user)[0];

	const space = Object.values(recordMap.space).find(({ value }) => space_cb(value));
	if (space) {
		const { id: space_id, shard_id } = space.value;
		createTransaction(shard_id, space_id, [ Operations.block.set('', [], {}) ]);
	} else throw new Error('The callback didnot return any space');
}
