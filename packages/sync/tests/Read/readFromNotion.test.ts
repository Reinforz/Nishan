import { NotionCache } from '@nishans/cache';
import { NotionSync } from '../../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

it('readFromNotion', async () => {
	const initializeCacheForSpecificDataMock = jest
			.spyOn(NotionCache, 'initializeCacheForSpecificData')
			.mockImplementation(async () => undefined),
		extractDataMock = jest
			.spyOn(NotionSync.ExtractData, 'extract')
			.mockImplementationOnce(() => ({ data: 'block' } as any));

	const block_1: any = {
			id: 'block_1',
			view_ids: [ 'view_1' ],
			collection_id: 'collection_1'
		},
		view_1: any = {
			id: 'view_1'
		},
		collection_1: any = {
			id: 'collection_1'
		},
		row_page_1: any = {
			type: 'page',
			id: 'block_2',
			parent_id: 'collection_1',
			parent_table: 'collection'
		},
		template_page_1: any = {
			type: 'page',
			id: 'block_3',
			parent_id: 'collection_1',
			parent_table: 'collection',
			is_template: true
		};

	const data = await NotionSync.Read.fromNotion('block_1', {
		cache: {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ], [ 'block_2', row_page_1 ], [ 'block_3', template_page_1 ] ]),
			collection: new Map([ [ 'collection_1', collection_1 ] ]),
			collection_view: new Map([ [ 'view_1', view_1 ] ])
		},
		token: 'token',
		user_id: 'user_1'
	});

	expect(initializeCacheForSpecificDataMock).toHaveBeenCalledTimes(2);
	expect(initializeCacheForSpecificDataMock.mock.calls[0].slice(0, 2)).toEqual([ 'block_1', 'block' ]);
	expect(initializeCacheForSpecificDataMock.mock.calls[1].slice(0, 2)).toEqual([ 'collection_1', 'collection' ]);
	expect(data).toStrictEqual({ data: 'block' });
	expect(extractDataMock).toHaveBeenCalledWith({
		collection: collection_1,
		views: [ view_1 ],
		template_pages: [ template_page_1 ],
		row_pages: [ row_page_1 ]
	});
});
