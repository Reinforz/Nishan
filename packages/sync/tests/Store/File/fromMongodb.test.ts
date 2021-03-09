import { NotionSync } from '../../../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`storeInFileFromMongodb`, async () => {
	const writeToFileMock = jest.spyOn(NotionSync.Write, 'toFile').mockImplementationOnce(async () => undefined),
		readFromMongodbMock = jest.spyOn(NotionSync.Read, 'fromMongodb').mockImplementationOnce(async () => ({} as any));

	await NotionSync.Store.InFile.fromMongodb('connection_uri', 'data.json');

	expect(writeToFileMock).toHaveBeenCalledTimes(1);
	expect(readFromMongodbMock).toHaveBeenCalledTimes(1);
});
