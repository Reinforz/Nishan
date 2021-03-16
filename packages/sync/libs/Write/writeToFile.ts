import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import { NotionSync } from '../';
import { INotionSyncFileShape } from '../types';

/**
 * Writes extracted notion data to a local file
 * @param filepath Full path of the file to write data to
 * @param result_data Extracted notion data
 */
export async function writeToFile (filepath: string, result_data: INotionSyncFileShape) {
	const ext = path.extname(filepath);
	if (ext === '.json')
		await fs.promises.writeFile(filepath, JSON.stringify(NotionSync.extractData(result_data), null, 2), 'utf-8');
	else if (ext === '.yaml' || ext === '.yml') {
		const extracted_data = NotionSync.extractData(result_data);
		const yaml_data = yaml.dump(extracted_data);
		await fs.promises.writeFile(filepath, yaml_data, 'utf-8');
	} else
		throw new Error('Unsupported output file extension. Use either json or yaml file when specifying the filepath');
}
