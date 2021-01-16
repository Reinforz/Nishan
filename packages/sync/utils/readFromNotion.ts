import axios from 'axios';
import {
	ICollection,
	IPage,
	QueryCollectionResult,
	SyncRecordValuesResult,
	TCollectionBlock,
	TView
} from '@nishans/types';
import { extractCollectionData, extractPagesData, extractViewsData, idToUuid } from '.';
import { LocalFileStructure } from '../src/types';
import { extractData } from './extractData';

export async function readFromNotion (token: string, database_id: string) {
	const headers = {
		headers: {
			cookie: `token_v2=${token};`
		}
	};
	database_id = idToUuid(database_id);
	const { data } = await axios.post<SyncRecordValuesResult>(
		'https://www.notion.so/api/v3/syncRecordValues',
		{
			requests: [
				{
					id: database_id,
					table: 'block',
					version: 0
				}
			]
		},
		headers
	);

	const block_data = data.recordMap.block[database_id].value as TCollectionBlock;

	const { collection_id, view_ids } = block_data;

	const { data: { recordMap } } = await axios.post<SyncRecordValuesResult>(
		'https://www.notion.so/api/v3/syncRecordValues',
		{
			requests: [
				{
					id: collection_id,
					table: 'collection',
					version: 0
				},
				...view_ids.map((view_id) => ({ id: view_id, table: 'collection_view', version: 0 }))
			]
		},
		headers
	);
	const collection = recordMap.collection[collection_id].value as ICollection;
	const views = Object.values(recordMap.collection_view).map(({ value }) => value) as TView[];

	const { data: { recordMap: { block } } } = await axios.post<QueryCollectionResult>(
		'https://www.notion.so/api/v3/queryCollection',
		{
			collectionId: collection_id,
			collectionViewId: '',
			query: {},
			loader: {
				type: 'table',
				loadContentCover: true
			}
		},
		headers
	);

	const row_pages = Object.values(block)
		.filter(
			({ value }) => value.type === 'page' && value.parent_table === 'collection' && value.parent_id === collection_id
		)
		.map(({ value }) => value) as IPage[];

	const template_pages_data: IPage[] = [];

	if (collection.template_pages) {
		const { data: { recordMap: { block: template_blocks } } } = await axios.post<SyncRecordValuesResult>(
			'https://www.notion.so/api/v3/syncRecordValues',
			{
				requests: [ ...collection.template_pages.map((page_id) => ({ id: page_id, table: 'block', version: 0 })) ]
			},
			headers
		);
		Object.values(template_blocks).forEach(({ value }) => template_pages_data.push(value as IPage));
	}
  return extractData({
    collection,
    views,
    template_pages: collection.template_pages ?? [] as any,
    row_pages
  })
}
