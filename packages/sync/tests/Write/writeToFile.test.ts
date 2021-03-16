import fs from 'fs';
import yaml from 'js-yaml';
import { NotionSync } from '../../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

describe(`writeToFile`, () => {
	it(`ext=json`, async () => {
		const data: any = { views: [] },
			writeFileMock = jest.spyOn(fs.promises, 'writeFile').mockImplementationOnce(async () => undefined),
			extractDataMock = jest.spyOn(NotionSync, 'extractData').mockImplementationOnce(() => data);
		await NotionSync.Write.toFile('data.json', data);
		expect(writeFileMock).toHaveBeenCalledWith('data.json', JSON.stringify(data, null, 2), 'utf-8');
		expect(extractDataMock).toHaveBeenCalledWith(data);
	});

	it(`throw error for unknown extension`, async () => {
		await expect(() => NotionSync.Write.toFile('data.txt', { views: [] } as any)).rejects.toThrow();
	});

	it(`ext=yaml`, async () => {
		const data: any = { views: [] },
			writeFileMock = jest.spyOn(fs.promises, 'writeFile').mockImplementationOnce(async () => undefined),
			extractDataMock = jest.spyOn(NotionSync, 'extractData').mockImplementationOnce(() => data),
			yamlDumpMock = jest.spyOn(yaml, 'dump').mockImplementationOnce(() => data);
		await NotionSync.Write.toFile('data.yml', data);
		expect(writeFileMock).toHaveBeenCalledWith('data.yml', data, 'utf-8');
		expect(extractDataMock).toHaveBeenCalledWith(data);
		expect(yamlDumpMock).toHaveBeenCalledWith(data);
	});
});
