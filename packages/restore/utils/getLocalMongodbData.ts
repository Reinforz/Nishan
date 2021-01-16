import { MongoClient } from 'mongodb';
import { CollectionExtracted, TViewExtracted, RowPageExtracted, LocalFileStructure } from '../src/types';

export async function getLocalMongodbData (database_name: string) {
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

		return {
			collection: collection_data[0],
			views: views_data,
			row_pages: row_pages_data,
			template_pages: template_pages_data
		} as LocalFileStructure;
	} finally {
		await localclient.close();
	}
}
