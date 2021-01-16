import fs from 'fs';
import path from 'path';
import { dump } from 'js-yaml';
import { MongoClient } from 'mongodb';

import { fetchDatabaseData } from './fetchDatabaseData';
import { CollectionExtracted, LocalFileStructure, RowPageExtracted, TViewExtracted } from './types';
import { extractCollectionData, extractViewsData, extractRowPagesData } from '../utils';

async function storeInFile (filepath: string, result_data: LocalFileStructure) {
	const ext = path.extname(filepath);
	if (ext === '.json') await fs.promises.writeFile(filepath, JSON.stringify(result_data, null, 2), 'utf-8');
	else if (ext === '.yaml' || ext === '.yml') await fs.promises.writeFile(filepath, dump(result_data), 'utf-8');
	else throw new Error('Unsupported output file extension. Use either json or yaml file when speciying the filepath');
}

/**
 * Stores data from notion collection block into a local file
 * @param token Notion token
 * @param database_id Id of the notion collection block
 * @param filepath full path of the output file
 */
export async function storeInLocalFileFromNotion (token: string, database_id: string, filepath: string) {
	const { collection_data, views_data, row_pages_data, template_pages_data } = await fetchDatabaseData(
		token,
		database_id
	);

	const result_data = {
		collection: extractCollectionData(collection_data),
		views: extractViewsData(views_data),
		row_pages: extractRowPagesData(row_pages_data),
		template_pages: extractRowPagesData(template_pages_data)
	} as LocalFileStructure;

	await storeInFile(filepath, result_data);
}

/**
 * Stores data from local mongodb instance into a local file
 * @param database_name Name of the local mongodb database
 * @param filepath full path of the output file
 */
export async function storeInLocalFileFromMongodb (database_name: string, filepath: string) {
	const ext = path.extname(filepath);
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
			collection: extractCollectionData(collection_data[0] as any),
			views: extractViewsData(views_data as any),
			row_pages: extractRowPagesData(row_pages_data as any),
			template_pages: extractRowPagesData(template_pages_data as any)
		} as LocalFileStructure;

		await storeInFile(filepath, result_data);
	} finally {
		await client.close();
	}
}
