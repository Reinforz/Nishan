import { MongoClient } from 'mongodb';
import path from 'path';
import fs from 'fs';
import { load } from 'js-yaml';

import { fetchDatabaseData } from './fetchDatabaseData';
import {
	CollectionBlockExtracted,
	CollectionExtracted,
	LocalFileStructure,
	RowPageExtracted,
	TViewExtracted
} from './types';
import { ICollection, IPage, TCollectionBlock, TView } from '@nishans/types';

const extractCollectionBlockData = ({ id, collection_id, view_ids }: TCollectionBlock) =>
	({
		id,
		collection_id,
		view_ids
	} as CollectionBlockExtracted);

const extractCollectionData = ({ name, icon, cover, id, schema, parent_id }: ICollection) =>
	({
		name,
		icon,
		cover,
		id,
		schema,
		parent_id
	} as CollectionExtracted);

const extractViewsData = (views_data: TView[]) =>
	views_data.map(({ id, type, name, format, query2, parent_id }) => ({
		id,
		type,
		name,
		format,
		query2,
		parent_id
	})) as TViewExtracted[];

const extractRowPagesData = (row_pages: IPage[]) =>
	row_pages.map(({ id, properties, format }) => ({
		id,
		properties,
		format
	})) as RowPageExtracted[];

async function storeToMongodb (arg: LocalFileStructure) {
	const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
	try {
		await client.connect();
		const { block, collection, views, row_pages } = arg;
		const db = client.db(`${collection.name}`),
			block_collection = await db.createCollection<CollectionBlockExtracted>('block'),
			collection_collection = await db.createCollection<CollectionExtracted>('collection'),
			views_collection = await db.createCollection<TViewExtracted>('views'),
			row_pages_collection = await db.createCollection<RowPageExtracted>('row_pages');

		await block_collection.insertOne(block);
		await collection_collection.insertOne(collection);
		await views_collection.insertMany(views);
		await row_pages_collection.insertMany(row_pages);
	} finally {
		await client.close();
	}
}

export async function storeInLocalMongodbFromNotion (token: string, database_id: string) {
	const { block_data, collection_data, views_data, row_pages_data } = await fetchDatabaseData(token, database_id);

	await storeToMongodb({
		block: extractCollectionBlockData(block_data),
		collection: extractCollectionData(collection_data),
		views: extractViewsData(views_data),
		row_pages: extractRowPagesData(row_pages_data)
	});
}

export async function storeInLocalMongodbFromFile (file_path: string) {
	const ext = path.extname(file_path);
	let data: LocalFileStructure = {} as any;
	if (ext === '.json') {
		data = JSON.parse(await fs.promises.readFile(file_path, 'utf-8'));
	} else if (ext === '.yaml' || ext === '.yml') {
		data = load(await fs.promises.readFile(file_path, 'utf-8')) as LocalFileStructure;
	} else throw new Error('Unsupported output file extension. Use either json or yaml file when speciying the filepath');
	await storeToMongodb({
		block: extractCollectionBlockData(data.block as TCollectionBlock),
		collection: extractCollectionData(data.collection as ICollection),
		views: extractViewsData(data.views as TView[]),
		row_pages: extractRowPagesData(data.row_pages as IPage[])
	});
}
