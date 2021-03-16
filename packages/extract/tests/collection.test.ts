import { CollectionExtracted, NotionExtract } from '../libs';

it(`extract collection data`, () => {
	const extracted_collection_data: CollectionExtracted = {
		name: [ [ 'Name' ] ],
		schema: {},
		cover: '',
		description: [ [ '' ] ],
		icon: ''
	};

	expect(NotionExtract.collection({ ...extracted_collection_data, extra: 'data' } as any)).toStrictEqual(
		extracted_collection_data
	);
});
