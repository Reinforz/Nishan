import { IOperation } from '@nishans/types';
import { removeEmptyOperationsPlugin } from '../../../src';

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

		expect(removeEmptyOperationsPlugin()(operation)).toStrictEqual(false);
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

		expect(removeEmptyOperationsPlugin()(operation)).toStrictEqual(operation);
	});
});
