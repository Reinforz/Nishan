import { NotionSync } from '../../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`restoreFromFile`, async () => {
	const writeToNotionMock = jest.spyOn(NotionSync.Write, 'toNotion').mockImplementationOnce(async () => undefined),
		readFromFileMock = jest.spyOn(NotionSync.Read, 'fromFile').mockImplementationOnce(async () => ({} as any));

	await NotionSync.Restore.fromFile('data.json', {} as any);

	expect(writeToNotionMock).toHaveBeenCalledTimes(1);
	expect(readFromFileMock).toHaveBeenCalledTimes(1);
});
