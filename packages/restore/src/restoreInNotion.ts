import path from 'path';
import fs from 'fs';
import { load } from 'js-yaml';
import axios from 'axios';

import { CollectionExtracted, LocalFileStructure, RowPageExtracted, TViewExtracted } from './types';
import { ISpace, LoadUserContentResult } from '@nishans/types';
import { MongoClient } from 'mongodb';
import { createRestorationOperations } from './createRestorationOperations';

export async function restoreNotionFromLocalMongodb (
	token: string,
	database_name: string,
	space_cb: (space: ISpace) => boolean | undefined
) {
	const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
	try {
		await client.connect();
		const db = client.db(database_name);
		const collection_collection = db.collection<CollectionExtracted>('collection'),
			collection_data = await collection_collection.find({}).toArray(),
			views_data_collection = db.collection<TViewExtracted>('views'),
			views_data = await views_data_collection.find({}).toArray(),
			row_pages_collection = db.collection<RowPageExtracted>('row_pages'),
			row_pages_data = await row_pages_collection.find({}).toArray(),
			template_pages_collection = db.collection<RowPageExtracted>('template_pages'),
			template_pages_data = await template_pages_collection.find({}).toArray();
		const result_data = {
			collection: collection_data[0],
			views: views_data,
			row_pages: row_pages_data,
			template_pages: template_pages_data
		} as LocalFileStructure;
		await createRestorationOperations(token, space_cb, result_data);
	} finally {
		await client.close();
	}
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
