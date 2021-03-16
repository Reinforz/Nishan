import fs from 'fs';
import { load } from 'js-yaml';
import path from 'path';
import { NotionSync } from '../';
import { LocalFileStructure } from '../types';

/**
 * Reads and extracts data from a local file
 * @param file_path Path of the file to read from
 * @returns Extracted data from the read file
 */
export async function readFromFile (file_path: string) {
	const ext = path.extname(file_path);
	let data: LocalFileStructure = {} as any;
	if (ext === '.json') data = JSON.parse(await fs.promises.readFile(file_path, 'utf-8'));
	else if (ext === '.yaml' || ext === '.yml')
		data = load(await fs.promises.readFile(file_path, 'utf-8')) as LocalFileStructure;
	else throw new Error('Unsupported output file extension. Use either json or yaml file when specifying the filepath');

	return NotionSync.extractData(data);
}
