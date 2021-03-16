import { MongoClient } from 'mongodb';
import { NotionSync } from '../../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`writeToMongodb`, async () => {
	const extractDataMock = jest.spyOn(NotionSync, 'extractData').mockImplementationOnce(
			() =>
				({
					views: [ 'view_1' ],
					row_pages: [ 'block_1' ],
					template_pages: [ 'block_2' ],
					collection: 'collection_1'
				} as any)
		),
		clientCloseMock = jest.spyOn(MongoClient.prototype, 'close').mockImplementationOnce(async () => undefined),
		collection_collection_mock = jest.fn(),
		views_collection_mock = jest.fn(),
		row_pages_collection_mock = jest.fn(),
		template_pages_collection_mock = jest.fn(),
		mongoConnectMock = jest.spyOn(MongoClient.prototype, 'connect').mockImplementationOnce(async () => undefined),
		collection_strings: string[] = [],
		mongoDbMock = jest.spyOn(MongoClient.prototype, 'db').mockImplementationOnce(() => {
			return {
				createCollection: (collection_string: string) => {
					collection_strings.push(collection_string);
					switch (collection_string) {
						case 'views':
							return {
								insertMany: views_collection_mock
							};
						case 'collection':
							return {
								insertOne: collection_collection_mock
							};
						case 'row_pages':
							return {
								insertMany: row_pages_collection_mock
							};
						case 'template_pages':
							return {
								insertMany: template_pages_collection_mock
							};
					}
				}
			} as any;
		});

	await NotionSync.Write.toMongodb('collection_uri', { views: [] } as any);

	expect(extractDataMock).toHaveBeenCalledWith({ views: [] });
	expect(mongoDbMock).toHaveBeenCalledTimes(1);
	expect(mongoConnectMock).toHaveBeenCalledTimes(1);
	expect(collection_strings.sort()).toStrictEqual([ 'collection', 'row_pages', 'template_pages', 'views' ]);
	expect(template_pages_collection_mock).toHaveBeenCalledWith([ 'block_2' ]);
	expect(row_pages_collection_mock).toHaveBeenCalledWith([ 'block_1' ]);
	expect(collection_collection_mock).toHaveBeenCalledWith('collection_1');
	expect(views_collection_mock).toHaveBeenCalledWith([ 'view_1' ]);
	expect(clientCloseMock).toHaveBeenCalledTimes(1);
});
