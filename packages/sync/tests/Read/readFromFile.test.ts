import fs from 'fs';
import yaml from 'js-yaml';
import { NotionSync } from '../../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

describe(`readFromFile`, () => {
	it(`ext=json`, async () => {
		const readFileMock = jest
			.spyOn(fs.promises, 'readFile')
			.mockImplementationOnce(async () => JSON.stringify({ views: [] }) as any);
		const extractDataMock = jest.spyOn(NotionSync, 'extractData').mockImplementationOnce(() => ({ views: [] } as any));
		const data = await NotionSync.Read.fromFile('data.json');
		expect(readFileMock).toHaveBeenCalledWith('data.json', 'utf-8');
		expect(extractDataMock).toHaveBeenCalledWith({ views: [] });
		expect(data).toStrictEqual({ views: [] });
	});

	it(`throw error for unknown extension`, async () => {
		await expect(() => NotionSync.Read.fromFile('data.txt')).rejects.toThrow();
	});

	it(`ext=yaml`, async () => {
		const readFileMock = jest.spyOn(fs.promises, 'readFile').mockImplementationOnce(async () => 'views:\n\t- View One');
		const yamlLoadMock = jest.spyOn(yaml, 'load').mockImplementationOnce(() => ({ views: [] }));
		const extractDataMock = jest.spyOn(NotionSync, 'extractData').mockImplementationOnce(() => ({ views: [] } as any));
		const data = await NotionSync.Read.fromFile('data.yaml');
		expect(readFileMock).toHaveBeenCalledWith('data.yaml', 'utf-8');
		expect(extractDataMock).toHaveBeenCalledWith({ views: [] });
		expect(data).toStrictEqual({ views: [] });
		expect(yamlLoadMock).toHaveBeenCalledWith('views:\n\t- View One');
	});
});
