import { NotionMutations } from '@nishans/endpoints';
import { IOperation } from '@nishans/types';
import { NotionOperationsObject, NotionOperationsPlugin } from '../libs';

const operation: IOperation = {
	args: {},
	command: 'update',
	pointer: {
		table: 'block',
		id: '123'
	},
	path: []
};

const common_execute_operations_options = {
	notion_operation_plugins: [],
	token: 'token',
	shard_id: 123,
	space_id: 'space_1'
};

describe('executeOperations', () => {
	it(`print to console if the stack is empty`, async () => {
		const consoleLogMock = jest.spyOn(console, 'log');
		await NotionOperationsObject.executeOperations([], common_execute_operations_options);
		expect(consoleLogMock).toHaveBeenCalledWith(`The operation stack is empty`);
	});

	it(`executes operations`, async () => {
		const saveTransactionsMock = jest
			.spyOn(NotionMutations, 'saveTransactions')
			.mockImplementationOnce(async () => ({}));
		const stack: IOperation[] = [ operation ];
		await NotionOperationsObject.executeOperations(stack, common_execute_operations_options);

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

it(`applyPluginsToOperationsStack`, () => {
	const stack: IOperation[] = [
		operation,
		{
			args: {
				last_edited_time: Date.now(),
				last_edited_by_id: 'id',
				last_edited_by_table: 'notion_user',
				other_data: 'other data'
			},
			command: 'update',
			path: [],
			pointer: {
				id: 'id',
				table: 'block'
			}
		},
		{
			args: {
				last_edited_time: Date.now(),
				last_edited_by_id: 'id',
				last_edited_by_table: 'notion_user'
			},
			command: 'update',
			path: [],
			pointer: {
				id: 'id',
				table: 'block'
			}
		}
	];

	const updated_operations = NotionOperationsObject.applyPluginsToOperationsStack(stack, [
		NotionOperationsPlugin.removeLastEditedProps(),
		NotionOperationsPlugin.removeEmptyOperations()
	]);

	expect(updated_operations).toStrictEqual([
		{
			args: {
				other_data: 'other data'
			},
			command: 'update',
			path: [],
			pointer: {
				id: 'id',
				table: 'block'
			}
		}
	]);
});
