import path from 'path';
import fs from 'fs';
import { load } from 'js-yaml';

import { LocalFileStructure } from '../src/types';
import { TView } from '@nishans/types';
import { extractCollectionData, extractViewsData, extractRowPagesData } from './extract';

export async function readFromFile (file_path: string) {
	const ext = path.extname(file_path);
	let data: LocalFileStructure = {} as any;
	if (ext === '.json') {
		data = JSON.parse(await fs.promises.readFile(file_path, 'utf-8'));
	} else if (ext === '.yaml' || ext === '.yml') {
		data = load(await fs.promises.readFile(file_path, 'utf-8')) as LocalFileStructure;
	} else throw new Error('Unsupported output file extension. Use either json or yaml file when speciying the filepath');

	return {
		collection: extractCollectionData(data.collection as any),
		views: extractViewsData(data.views as TView[]),
		row_pages: extractRowPagesData(data.row_pages as any),
		template_pages: extractRowPagesData(data.template_pages as any)
	} as LocalFileStructure;
}
