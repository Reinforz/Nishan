import { Mutations } from '@nishans/endpoints';
import { IOperation } from '@nishans/types';
import { NotionOperationsClass, removeEmptyOperationsPlugin, removeLastEditedPropsPlugin } from '../../src';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('executeOperation', () => {
	it(`print to console if the stack is empty`, async () => {
		const consoleLogMock = jest.spyOn(console, 'log');
		const operations_class = new NotionOperationsClass({
			shard_id: 123,
			space_id: 'space_1',
			stack: [],
			token: 'token'
		});
		await operations_class.executeOperation();
		expect(consoleLogMock).toHaveBeenCalledWith(`The operation stack is empty`);
	});

	it(`executes operations`, async () => {
		const saveTransactionsMock = jest
			.spyOn(Mutations, 'saveTransactions')
			.mockImplementationOnce(async () => undefined);
		const stack: IOperation[] = [
			{
				args: {},
				command: 'update',
				id: 'id',
				path: [],
				table: 'block'
			}
		];
		const operations_class = new NotionOperationsClass({
			shard_id: 123,
			space_id: 'space_1',
			stack,
			token: 'token'
		});
		await operations_class.executeOperation();
		expect(saveTransactionsMock).toHaveBeenCalledWith(
			{
				requestId: expect.any(String),
				transactions: [
					{
						id: expect.any(String),
						shardId: 123,
						spaceId: 'space_1',
						operations: stack
					}
				]
			},
			{
				token: 'token',
				interval: 0
			}
		);
		expect(stack).toHaveLength(0);
	});
});

it(`printStack`, async () => {
	const stack: IOperation[] = [
		{
			args: {},
			command: 'update',
			id: 'id',
			path: [],
			table: 'block'
		}
	];
	const consoleLogMock = jest.spyOn(console, 'log');
	const jsonStringifyMock = jest.spyOn(JSON, 'stringify').mockImplementationOnce(() => 'mocked value');
	const operations_class = new NotionOperationsClass({
		shard_id: 123,
		space_id: 'space_1',
		stack,
		token: 'token'
	});
	operations_class.printStack();
	expect(jsonStringifyMock).toHaveBeenCalledWith(stack, null, 2);
	expect(consoleLogMock).toHaveBeenCalledTimes(1);
	expect(consoleLogMock).toHaveBeenCalledWith('mocked value');
});

it(`applyPluginsToOperationsStack`, () => {
	const stack: IOperation[] = [
		{
			args: {},
			command: 'update',
			id: 'id',
			path: [],
			table: 'block'
		},
		{
			args: {
				last_edited_time: Date.now(),
				last_edited_by_id: 'id',
				last_edited_by_table: 'notion_user',
				other_data: 'other data'
			},
			command: 'update',
			id: 'id',
			path: [],
			table: 'block'
		},
		{
			args: {
				last_edited_time: Date.now(),
				last_edited_by_id: 'id',
				last_edited_by_table: 'notion_user'
			},
			command: 'update',
			id: 'id',
			path: [],
			table: 'block'
		}
	];

	const operations = new NotionOperationsClass({
		shard_id: 123,
		space_id: 'space_1',
		stack,
		token: 'token',
		plugins: [ removeLastEditedPropsPlugin(), removeEmptyOperationsPlugin() ]
	});

	const updated_operations = operations.applyPluginsToOperationsStack();

	expect(updated_operations).toStrictEqual([
		{
			args: {
				other_data: 'other data'
			},
			command: 'update',
			id: 'id',
			path: [],
			table: 'block'
		}
	]);
});
