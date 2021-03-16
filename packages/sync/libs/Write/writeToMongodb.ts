import { CollectionExtracted, PageExtracted, TViewExtracted } from '@nishans/extract';
import { MongoClient } from 'mongodb';
import { LocalFileStructure, NotionSync } from '../';

/**
 * Writes extracted notion data to a mongodb instance
 * @param connection_uri Connection uri of the mongodb instance
 * @param result_data Extracted notion data to write
 */
export async function writeToMongodb (connection_uri: string, result_data: LocalFileStructure) {
	const client = new MongoClient(connection_uri, { useNewUrlParser: true, useUnifiedTopology: true });
	const { collection, views, row_pages, template_pages } = NotionSync.extractData(result_data);
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
