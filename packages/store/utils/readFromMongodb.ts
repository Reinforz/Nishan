import { MongoClient } from 'mongodb';

import { CollectionExtracted, LocalFileStructure, RowPageExtracted, TViewExtracted } from '../src/types';
import { extractCollectionData, extractViewsData, extractRowPagesData } from './extract';

export async function readFromMongodb (connection_uri: string) {
	const client = new MongoClient(connection_uri, { useNewUrlParser: true, useUnifiedTopology: true });
	try {
		await client.connect();
		const db = client.db();
		const collection_collection = db.collection<CollectionExtracted>('collection'),
			collection_data = await collection_collection.find({}).toArray(),
			views_data_collection = db.collection<TViewExtracted>('views'),
			views_data = await views_data_collection.find({}).toArray(),
			row_pages_collection = db.collection<RowPageExtracted>('row_pages'),
			row_pages_data = await row_pages_collection.find({}).toArray(),
			template_pages_collection = db.collection<RowPageExtracted>('template_pages'),
			template_pages_data = await template_pages_collection.find({}).toArray();

		return {
			collection: extractCollectionData(collection_data[0] as any),
			views: extractViewsData(views_data as any),
			row_pages: extractRowPagesData(row_pages_data as any),
			template_pages: extractRowPagesData(template_pages_data as any)
		} as LocalFileStructure;
	} finally {
		await client.close();
	}
}
