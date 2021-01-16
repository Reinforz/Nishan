import { load } from 'js-yaml';
import path from 'path';
import fs from 'fs';
import { MongoClient } from 'mongodb';

import { CollectionExtracted, LocalFileStructure, RowPageExtracted, TViewExtracted } from './types';

export async function restoreAtlasFromLocalFile (connection_uri: string, filepath: string) {
	const ext = path.extname(filepath);
	let result_data: LocalFileStructure = {} as any;

	if (ext === '.json') result_data = JSON.parse(await fs.promises.readFile(filepath, 'utf-8'));
	else if (ext === '.yaml' || ext === '.yml')
		result_data = load(await fs.promises.readFile(filepath, 'utf-8')) as LocalFileStructure;
	else throw new Error('Unsupported file extension. Use either json or yaml file when speciying the filepath');

	const client = new MongoClient(connection_uri, { useNewUrlParser: true, useUnifiedTopology: true });
	const { collection, views, row_pages, template_pages } = result_data;
	try {
		await client.connect();
		const db = client.db();
		const collection_collection = await db.createCollection<CollectionExtracted>('collection'),
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

export async function restoreAtlasFromLocalMongodb (connection_uri: string, database_name: string) {
	const localclient = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
	try {
		await localclient.connect();
		const db = localclient.db(database_name);
		const collection_collection = db.collection<CollectionExtracted>('collection'),
			collection_data = await collection_collection.find({}).toArray(),
			views_data_collection = db.collection<TViewExtracted>('views'),
			views_data = await views_data_collection.find({}).toArray(),
			row_pages_collection = db.collection<RowPageExtracted>('row_pages'),
			row_pages_data = await row_pages_collection.find({}).toArray(),
			template_pages_collection = db.collection<RowPageExtracted>('template_pages'),
			template_pages_data = await template_pages_collection.find({}).toArray();

		const remoteclient = new MongoClient(connection_uri, { useNewUrlParser: true, useUnifiedTopology: true });
		try {
			await remoteclient.connect();
			const db = remoteclient.db();
			const collection_collection = await db.createCollection<CollectionExtracted>('collection'),
				views_collection = await db.createCollection<TViewExtracted>('views'),
				row_pages_collection = await db.createCollection<RowPageExtracted>('row_pages'),
				template_pages_collection = await db.createCollection<RowPageExtracted>('template_pages');
			await collection_collection.insertOne(collection_data[0]);
			await views_collection.insertMany(views_data);
			await row_pages_collection.insertMany(row_pages_data);
			await template_pages_collection.insertMany(template_pages_data);
		} finally {
			await remoteclient.close();
		}
	} finally {
		await localclient.close();
	}
}
