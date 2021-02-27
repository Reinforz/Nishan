import { IOperation } from '@nishans/types';
import { NotionOperationsPlugin } from '../../libs';
import { NotionOperationsPluginOptions } from '../../libs/Plugins/Options';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('validateOperationsPlugin', () => {
	it(`Should throw for unsupported operation table`, () => {
		const operation: IOperation = {
			args: {},
			command: 'update',
			pointer: {
				id: '123',
				table: 'blocks' as any
			},
			path: []
		};

		const skipPluginOptionMock = jest
			.spyOn(NotionOperationsPluginOptions, 'skip')
			.mockImplementationOnce(() => operation);

		expect(() =>
			NotionOperationsPlugin.validateOperations({
				skip: undefined
			})(operation)
		).toThrow(`Unsupported operation table blocks`);
		expect(skipPluginOptionMock).toHaveBeenCalledWith(operation, undefined);
	});

	it(`Should throw for unsupported operation command`, () => {
		const operation: IOperation = {
			args: {},
			command: 'updates' as any,
			path: [],
			pointer: {
				id: '123',
				table: 'block'
			}
		};

		const skipPluginOptionMock = jest
			.spyOn(NotionOperationsPluginOptions, 'skip')
			.mockImplementationOnce(() => operation);

		expect(() =>
			NotionOperationsPlugin.validateOperations({
				skip: undefined
			})(operation)
		).toThrow(`Unsupported operation command updates`);
		expect(skipPluginOptionMock).toHaveBeenCalledWith(operation, undefined);
	});

	it(`Should return operation if no error is found`, () => {
		const operation: IOperation = {
			args: {},
			command: 'update',
			path: [],
			pointer: {
				id: '123',
				table: 'block'
			}
		};

		const skipPluginOptionMock = jest
			.spyOn(NotionOperationsPluginOptions, 'skip')
			.mockImplementationOnce(() => operation);

		expect(NotionOperationsPlugin.validateOperations()(operation)).toStrictEqual(operation);
		expect(skipPluginOptionMock).toHaveBeenCalledWith(operation, undefined);
	});
});
