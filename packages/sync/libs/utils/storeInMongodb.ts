import { MongoClient } from 'mongodb';
import { CollectionExtracted, LocalFileStructure, PageExtracted, TViewExtracted } from '../types';
import { ExtractData } from './extractData';

export async function storeInMongodb (connection_uri: string, result_data: LocalFileStructure) {
	const client = new MongoClient(connection_uri, { useNewUrlParser: true, useUnifiedTopology: true });
	const { collection, views, row_pages, template_pages } = ExtractData.extract(result_data);
	try {
		await client.connect();
		const db = client.db();
		const collection_collection = await db.createCollection<CollectionExtracted>('collection'),
			views_collection = await db.createCollection<TViewExtracted>('views'),
			row_pages_collection = await db.createCollection<PageExtracted>('row_pages'),
			template_pages_collection = await db.createCollection<PageExtracted>('template_pages');
		await collection_collection.insertOne(collection);
		await views_collection.insertMany(views);
		await row_pages_collection.insertMany(row_pages);
		await template_pages_collection.insertMany(template_pages);
	} finally {
		await client.close();
	}
}
