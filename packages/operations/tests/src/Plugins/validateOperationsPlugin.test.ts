import { IOperation } from '@nishans/types';
import { Plugin } from '../../../src';
import { PluginOptions } from '../../../src/Plugins/Options';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('validateOperationsPlugin', () => {
	it(`Should throw for unsupported operation table`, () => {
		const operation: IOperation = {
			args: {},
			command: 'update',
			id: '123',
			path: [],
			table: 'blocks' as any
		};

		const skipPluginOptionMock = jest.spyOn(PluginOptions, 'skip').mockImplementationOnce(() => operation);

		expect(() =>
			Plugin.validateOperations({
				skip: undefined
			})(operation)
		).toThrow(`Unsupported operation table blocks`);
		expect(skipPluginOptionMock).toHaveBeenCalledWith(operation, undefined);
	});

	it(`Should throw for unsupported operation command`, () => {
		const operation: IOperation = {
			args: {},
			command: 'updates' as any,
			id: '123',
			path: [],
			table: 'block'
		};

		const skipPluginOptionMock = jest.spyOn(PluginOptions, 'skip').mockImplementationOnce(() => operation);

		expect(() =>
			Plugin.validateOperations({
				skip: undefined
			})(operation)
		).toThrow(`Unsupported operation command updates`);
		expect(skipPluginOptionMock).toHaveBeenCalledWith(operation, undefined);
	});

	it(`Should return operation if no error is found`, () => {
		const operation: IOperation = {
			args: {},
			command: 'update',
			id: '123',
			path: [],
			table: 'block'
		};

		const skipPluginOptionMock = jest.spyOn(PluginOptions, 'skip').mockImplementationOnce(() => operation);

		expect(Plugin.validateOperations()(operation)).toStrictEqual(operation);
		expect(skipPluginOptionMock).toHaveBeenCalledWith(operation, undefined);
	});
});
