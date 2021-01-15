import fs from 'fs';
import path from 'path';
import { dump } from 'js-yaml';

import { fetchDatabaseData } from './fetchDatabaseData';

export async function storeInLocalFileSystem (token: string, database_id: string, filepath: string) {
	const ext = path.extname(filepath);

	const [ block_data, collection_data, views_data ] = await fetchDatabaseData(token, database_id);

	const result_data = {
		block: block_data,
		collection: collection_data,
		views: views_data
	};
	if (ext === '.json') await fs.promises.writeFile(filepath, JSON.stringify(result_data, null, 2), 'utf-8');
	else if (ext === '.yaml' || ext === '.yml') await fs.promises.writeFile(filepath, dump(result_data), 'utf-8');
	else throw new Error('Unsupported output file extension. Use either json or yaml file when speciying the filepath');
}
