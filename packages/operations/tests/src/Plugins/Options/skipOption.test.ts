import { IOperation } from '@nishans/types';
import { skipOption } from '../../../../src/Plugins/Options/skipOption';

describe('skipOption', () => {
	const operation: IOperation = {
		args: {},
		command: 'keyedObjectListAfter',
		id: '123',
		path: [],
		table: 'block'
	};

	it(`Should skip based on skip value`, () => {
		expect(skipOption(operation, (op) => op.id === '123')).toStrictEqual(operation);
	});

	it(`Should not skip based on skip value`, () => {
		expect(skipOption(operation, (op) => op.id === '1234')).toStrictEqual(undefined);
	});

	it(`Should not skip if skip option not provided`, () => {
		expect(skipOption(operation)).toStrictEqual(undefined);
	});
});
