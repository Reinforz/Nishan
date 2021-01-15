import fs from 'fs';
import path from 'path';
import { dump } from 'js-yaml';

import { fetchDatabaseData } from './fetchDatabaseData';
import { LocalFileStructure } from './types';
import { extractCollectionBlockData, extractCollectionData, extractViewsData, extractRowPagesData } from '../utils';

export async function storeInLocalFileSystem (token: string, database_id: string, filepath: string) {
	const ext = path.extname(filepath);

	const { block_data, collection_data, views_data, row_pages_data, template_pages_data } = await fetchDatabaseData(
		token,
		database_id
	);

	const result_data = {
		block: extractCollectionBlockData(block_data),
		collection: extractCollectionData(collection_data),
		views: extractViewsData(views_data),
		row_pages: extractRowPagesData(row_pages_data),
		template_pages: extractRowPagesData(template_pages_data)
	} as LocalFileStructure;
	if (ext === '.json') await fs.promises.writeFile(filepath, JSON.stringify(result_data, null, 2), 'utf-8');
	else if (ext === '.yaml' || ext === '.yml') await fs.promises.writeFile(filepath, dump(result_data), 'utf-8');
	else throw new Error('Unsupported output file extension. Use either json or yaml file when speciying the filepath');
}
