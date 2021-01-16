import { MongoClient } from 'mongodb';
import path from 'path';
import fs from 'fs';
import { load } from 'js-yaml';
import { TCollectionBlock, TView } from '@nishans/types';

import { fetchDatabaseData } from './fetchDatabaseData';
import {
	CollectionBlockExtracted,
	CollectionExtracted,
	LocalFileStructure,
	RowPageExtracted,
	TViewExtracted
} from './types';

import { extractCollectionData, extractViewsData, extractRowPagesData } from '../utils';

async function storeToMongodb (arg: LocalFileStructure) {
	const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
	try {
		await client.connect();
		const { collection, views, row_pages, template_pages } = arg;
		const db = client.db(`${collection.name}`),
			collection_collection = await db.createCollection<CollectionExtracted>('collection'),
			views_collection = await db.createCollection<TViewExtracted>('views'),
			row_pages_collection = await db.createCollection<RowPageExtracted>('row_pages'),
			template_pages_collection = await db.createCollection<RowPageExtracted>('template_pages');
		await collection_collection.insertOne(collection);
		await views_collection.insertMany(views);
		await row_pages_collection.insertMany(row_pages);
		await template_pages_collection.insertMany(template_pages);
	} finally {
		await client.close();
	}
}

/**
 * Stores data from notion collection block into local mongodb instance
 * @param token Notion token
 * @param database_id Id of the notion collection block
 */
export async function storeInLocalMongodbFromNotion (token: string, database_id: string) {
	const { collection_data, views_data, row_pages_data, template_pages_data } = await fetchDatabaseData(
		token,
		database_id
	);

	await storeToMongodb({
		collection: extractCollectionData(collection_data),
		views: extractViewsData(views_data),
		row_pages: extractRowPagesData(row_pages_data),
		template_pages: extractRowPagesData(template_pages_data)
	});
}

/**
 * Stores data from local file from file system into local mongodb instance
 * @param file_path Full path to the output file
 */
export async function storeInLocalMongodbFromFile (file_path: string) {
	const ext = path.extname(file_path);
	let data: LocalFileStructure = {} as any;
	if (ext === '.json') {
		data = JSON.parse(await fs.promises.readFile(file_path, 'utf-8'));
	} else if (ext === '.yaml' || ext === '.yml') {
		data = load(await fs.promises.readFile(file_path, 'utf-8')) as LocalFileStructure;
	} else throw new Error('Unsupported output file extension. Use either json or yaml file when speciying the filepath');
	await storeToMongodb({
		collection: extractCollectionData(data.collection as any),
		views: extractViewsData(data.views as TView[]),
		row_pages: extractRowPagesData(data.row_pages as any),
		template_pages: extractRowPagesData(data.template_pages as any)
	});
}
