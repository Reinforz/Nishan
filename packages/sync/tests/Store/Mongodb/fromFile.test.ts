import { NotionSync } from '../../../libs';

it(`storeInMongodbFromAtlas`, async () => {
	const writeToMongodbMock = jest.spyOn(NotionSync.Write, 'toMongodb').mockImplementationOnce(async () => undefined),
		readFromFileMock = jest.spyOn(NotionSync.Read, 'fromFile').mockImplementationOnce(async () => ({} as any));

	await NotionSync.Store.InMongodb.fromFile('database_id', {} as any);

	expect(writeToMongodbMock).toHaveBeenCalledTimes(1);
	expect(readFromFileMock).toHaveBeenCalledTimes(1);
});
