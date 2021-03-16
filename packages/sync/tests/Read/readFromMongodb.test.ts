import { MongoClient } from 'mongodb';
import { NotionSync } from '../../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`readFromMongodb`, async () => {
	const extractDataMock = jest.spyOn(NotionSync, 'extractData').mockImplementationOnce(() => ({ views: [] } as any));
	const mongoConnectMock = jest.spyOn(MongoClient.prototype, 'connect').mockImplementationOnce(async () => undefined);
	const collection_strings: string[] = [];
	const mongoDbMock = jest.spyOn(MongoClient.prototype, 'db').mockImplementationOnce(() => {
		return {
			collection: (collection_string: string) => {
				collection_strings.push(collection_string);
				return {
					findOne () {
						return collection_string;
					},
					find () {
						return {
							toArray () {
								return [ collection_string ];
							}
						};
					}
				};
			}
		} as any;
	});

	await NotionSync.Read.fromMongodb('collection_uri');

	expect(mongoConnectMock).toHaveBeenCalledTimes(1);
	expect(mongoDbMock).toHaveBeenCalledTimes(1);
	expect(collection_strings.sort()).toStrictEqual([ 'collection', 'row_pages', 'template_pages', 'views' ]);
	expect(extractDataMock).toHaveBeenCalledWith({
		collection: 'collection',
		views: [ 'views' ],
		row_pages: [ 'row_pages' ],
		template_pages: [ 'template_pages' ]
	});
});
