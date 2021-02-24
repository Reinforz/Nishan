import { IOperation } from '@nishans/types';
import { skipOption } from '../../../../src/Plugins/Options/skip';

describe('skipOption', () => {
	const operation: IOperation = {
		args: {},
		command: 'keyedObjectListAfter',
		path: [],
		pointer: {
			id: '123',
			table: 'block'
		}
	};

	it(`Should skip based on skip value`, () => {
		expect(skipOption(operation, (op) => op.pointer.id === '123')).toStrictEqual(operation);
	});

	it(`Should not skip based on skip value`, () => {
		expect(skipOption(operation, (op) => op.pointer.id === '1234')).toStrictEqual(undefined);
	});

	it(`Should not skip if skip option not provided`, () => {
		expect(skipOption(operation)).toStrictEqual(undefined);
	});
});
