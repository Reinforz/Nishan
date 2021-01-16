import { MongoClient } from 'mongodb';

import { LocalFileStructure, CollectionExtracted, TViewExtracted, RowPageExtracted } from '../src/types';

export async function storeInMongodb (arg: LocalFileStructure) {
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
