import { NotionSync } from '../../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`restoreFromMongodb`, async () => {
	const writeToNotionMock = jest.spyOn(NotionSync.Write, 'toNotion').mockImplementationOnce(async () => undefined),
		readFromMongodbMock = jest.spyOn(NotionSync.Read, 'fromMongodb').mockImplementationOnce(async () => ({} as any));

	await NotionSync.Restore.fromMongodb('connection_uri', {} as any);

	expect(writeToNotionMock).toHaveBeenCalledTimes(1);
	expect(readFromMongodbMock).toHaveBeenCalledTimes(1);
});
