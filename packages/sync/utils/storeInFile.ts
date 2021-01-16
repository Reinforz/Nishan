import fs from 'fs';
import path from 'path';
import { dump } from 'js-yaml';

import { LocalFileStructure } from '../src/types';
import { extractData } from './extractData';

export async function storeInFile (filepath: string, result_data: LocalFileStructure) {
	const ext = path.extname(filepath);
	if (ext === '.json')
		await fs.promises.writeFile(filepath, JSON.stringify(extractData(result_data), null, 2), 'utf-8');
	else if (ext === '.yaml' || ext === '.yml')
		await fs.promises.writeFile(filepath, dump(extractData(result_data)), 'utf-8');
	else throw new Error('Unsupported output file extension. Use either json or yaml file when speciying the filepath');
}
