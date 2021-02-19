import { IOperation } from '@nishans/types';
import { skipOption } from '../../../../src/Plugins/utils/skipOption';

describe('skipOption', () => {
	it(`Should skip based on skip value`, () => {
		const operation: IOperation = {
			args: {},
			command: 'keyedObjectListAfter',
			id: '123',
			path: [],
			table: 'block'
		};

		expect(
			skipOption(
				{
					skip: (op) => op.id === '123'
				},
				operation
			)
		).toStrictEqual(operation);
	});

	it(`Should not skip based on skip value`, () => {
		const operation: IOperation = {
			args: {},
			command: 'keyedObjectListAfter',
			id: '123',
			path: [],
			table: 'block'
		};

		expect(
			skipOption(
				{
					skip: (op) => op.id === '1234'
				},
				operation
			)
		).toStrictEqual(undefined);
	});
});
