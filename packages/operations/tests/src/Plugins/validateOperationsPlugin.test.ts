import { IOperation } from '@nishans/types';
import { validateOperationsPlugin } from '../../../src';

describe('validateOperationsPlugin', () => {
	it(`Should throw for unsupported operation table`, () => {
		const operation: IOperation = {
			args: {},
			command: 'update',
			id: '123',
			path: [],
			table: 'blocks' as any
		};

		expect(() => validateOperationsPlugin()(operation)).toThrow(`Unsupported operation table blocks`);
	});

	it(`Should throw for unsupported operation command`, () => {
		const operation: IOperation = {
			args: {},
			command: 'updates' as any,
			id: '123',
			path: [],
			table: 'block'
		};

		expect(() => validateOperationsPlugin()(operation)).toThrow(`Unsupported operation command updates`);
	});

	it(`Should return operation if no error is found`, () => {
		const operation: IOperation = {
			args: {},
			command: 'update',
			id: '123',
			path: [],
			table: 'block'
		};

		expect(validateOperationsPlugin()(operation)).toStrictEqual(operation);
	});
});
