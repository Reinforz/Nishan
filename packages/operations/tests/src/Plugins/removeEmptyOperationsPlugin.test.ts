import { IOperation } from '@nishans/types';
import { Plugin } from '../../../src';
import { PluginOptions } from '../../../src/Plugins/Options';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('removeEmptyOperationsPlugin', () => {
	it(`Should work for empty args`, () => {
		const args = {},
			operation: IOperation = {
				args,
				command: 'update',
				id: '123',
				path: [],
				table: 'block'
			};

		const skipPluginOptionMock = jest.spyOn(PluginOptions, 'skip').mockImplementationOnce(() => operation);

		expect(
			Plugin.removeEmptyOperations({
				skip: undefined
			})(operation)
		).toStrictEqual(false);

		expect(skipPluginOptionMock).toHaveBeenCalledWith(operation, undefined);
	});

	it(`Should work for undefined args`, () => {
		const args = undefined,
			operation: IOperation = {
				args,
				command: 'update',
				id: '123',
				path: [],
				table: 'block'
			};

		const skipPluginOptionMock = jest.spyOn(PluginOptions, 'skip').mockImplementationOnce(() => operation);

		expect(
			Plugin.removeEmptyOperations({
				skip: undefined
			})(operation)
		).toStrictEqual(false);

		expect(skipPluginOptionMock).toHaveBeenCalledWith(operation, undefined);
	});

	it(`Should work for non empty args`, () => {
		const args = {
				a: 1
			},
			operation: IOperation = {
				args,
				command: 'update',
				id: '123',
				path: [],
				table: 'block'
			};

		const skipPluginOptionMock = jest.spyOn(PluginOptions, 'skip').mockImplementationOnce(() => operation);

		expect(
			Plugin.removeEmptyOperations({
				skip: undefined
			})(operation)
		).toStrictEqual(operation);
		expect(skipPluginOptionMock).toHaveBeenCalledWith(operation, undefined);
	});
});
