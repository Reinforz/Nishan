import { CollectionExtracted, PageExtracted, TViewExtracted } from '@nishans/extract';
import { NotionSync } from '../libs';

it(`extract views data`, () => {
	const extracted_views_data: TViewExtracted = {
		format: {} as any,
		name: 'View',
		type: 'board',
		query2: {}
	};

	const extracted_collection_data: CollectionExtracted = {
		name: [ [ 'Name' ] ],
		schema: {},
		cover: '',
		description: [ [ '' ] ],
		icon: ''
	};

	const extracted_page_data: PageExtracted = {
		properties: {
			title: [ [ 'Title' ] ]
		},
		is_template: true,
		format: {}
	};

	const { views, collection, row_pages, template_pages } = NotionSync.extractData({
		views: [ { ...extracted_views_data, extra: 'data' } as any ],
		collection: { ...extracted_collection_data, extra: 'data' } as any,
		template_pages: [ { ...extracted_page_data, extra: 'data' } as any ],
		row_pages: [ { ...extracted_page_data, extra: 'data' } as any ]
	});
	expect(views).toStrictEqual([ extracted_views_data ]);
	expect(collection).toStrictEqual(extracted_collection_data);
	expect(row_pages).toStrictEqual([ extracted_page_data ]);
	expect(template_pages).toStrictEqual([ extracted_page_data ]);
});
