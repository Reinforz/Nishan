import { NotionMutations } from '@nishans/endpoints';
import { IOperation } from '@nishans/types';
import { NotionOperations } from '../libs';
import { common_execute_operations_options, operation } from './utils';

describe('executeOperations', () => {
	it(`print to console if the stack is empty`, async () => {
		const consoleLogMock = jest.spyOn(console, 'log');
		await NotionOperations.executeOperations([], common_execute_operations_options);
		expect(consoleLogMock).toHaveBeenCalledWith(`The operation stack is empty`);
	});

	it(`executes operations`, async () => {
		const saveTransactionsMock = jest
			.spyOn(NotionMutations, 'saveTransactions')
			.mockImplementationOnce(async () => ({}));
		const stack: IOperation[] = [ operation ];
		await NotionOperations.executeOperations(stack, common_execute_operations_options);

		expect(saveTransactionsMock.mock.calls[0][0]).toStrictEqual({
			requestId: expect.any(String),
			transactions: [
				{
					id: expect.any(String),
					shardId: 123,
					spaceId: 'space_1',
					operations: stack
				}
			]
		});
		expect(stack).toHaveLength(0);
	});
});
