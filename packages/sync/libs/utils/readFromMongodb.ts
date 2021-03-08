import { MongoClient } from 'mongodb';
import { CollectionExtracted, PageExtracted, TViewExtracted } from '../types';
import { ExtractData } from './extractData';

export async function readFromMongodb (connection_uri: string) {
	const client = new MongoClient(connection_uri, { useNewUrlParser: true, useUnifiedTopology: true });
	try {
		await client.connect();
		const db = client.db();
		return ExtractData.extract({
			collection: await db.collection<CollectionExtracted>('collection').findOne({}),
			views: await db.collection<TViewExtracted>('views').find({}).toArray(),
			row_pages: await db.collection<PageExtracted>('row_pages').find({}).toArray(),
			template_pages: await db.collection<PageExtracted>('template_pages').find({}).toArray()
		} as any);
	} finally {
		await client.close();
	}
}
