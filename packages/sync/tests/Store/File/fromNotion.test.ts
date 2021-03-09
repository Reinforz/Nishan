import { NotionSync } from '../../../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`storeInFileFromNotion`, async () => {
	const writeToFileMock = jest.spyOn(NotionSync.Write, 'toFile').mockImplementationOnce(async () => undefined),
		readFromNotionMock = jest.spyOn(NotionSync.Read, 'fromNotion').mockImplementationOnce(async () => ({} as any));

	await NotionSync.Store.InFile.fromNotion('database_id', 'data.json', {} as any);

	expect(writeToFileMock).toHaveBeenCalledTimes(1);
	expect(readFromNotionMock).toHaveBeenCalledTimes(1);
});
