import { NotionSync } from '../../../libs';

it(`storeInMongodbFromNotion`, async () => {
	const writeToMongodbMock = jest.spyOn(NotionSync.Write, 'toMongodb').mockImplementationOnce(async () => undefined),
		readFromNotionMock = jest.spyOn(NotionSync.Read, 'fromNotion').mockImplementationOnce(async () => ({} as any));

	await NotionSync.Store.InMongodb.fromNotion('connection_uri', 'database_id', {} as any);

	expect(writeToMongodbMock).toHaveBeenCalledTimes(1);
	expect(readFromNotionMock).toHaveBeenCalledTimes(1);
});
