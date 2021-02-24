import { Mutations } from '@nishans/endpoints';
import { IOperation } from '@nishans/types';
import { NotionOperationsClass, NotionOperationsPlugin } from '../../src';

afterEach(() => {
	jest.restoreAllMocks();
});

const operation: IOperation = {
	args: {},
	command: 'update',
	pointer: {
		table: 'block',
		id: '123'
	},
	path: []
};

const returnDefaultOperationsClassArgs = () => {
	return {
		shard_id: 123,
		space_id: 'space_1',
		stack: [],
		token: 'token',
		user_id: '123'
	};
};

it(`emptyStack`, () => {
	const operations_class = new NotionOperationsClass(returnDefaultOperationsClassArgs());
	operations_class.emptyStack();
	expect(operations_class.stack).toStrictEqual([]);
});

describe('pushToStack', () => {
	let operations_class: NotionOperationsClass = null as any;
	beforeEach(() => {
		operations_class = new NotionOperationsClass(returnDefaultOperationsClassArgs());
	});

	it(`single op`, () => {
		operations_class.pushToStack(operation);
		expect(operations_class.stack).toStrictEqual([ operation ]);
	});

	it(`array of ops`, () => {
		operations_class.pushToStack([ operation ]);
		expect(operations_class.stack).toStrictEqual([ operation ]);
	});
});

describe('executeOperation', () => {
	it(`print to console if the stack is empty`, async () => {
		const consoleLogMock = jest.spyOn(console, 'log');
		const operations_class = new NotionOperationsClass(returnDefaultOperationsClassArgs());
		await operations_class.executeOperation();
		expect(consoleLogMock).toHaveBeenCalledWith(`The operation stack is empty`);
	});

	it(`executes operations`, async () => {
		const saveTransactionsMock = jest.spyOn(Mutations, 'saveTransactions').mockImplementationOnce(async () => ({}));
		const stack: IOperation[] = [ operation ];
		const operations_class = new NotionOperationsClass({
			...returnDefaultOperationsClassArgs(),
			stack
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
				interval: 0,
				user_id: '123'
			}
		);
		expect(stack).toHaveLength(0);
	});
});

it(`printStack`, async () => {
	const stack: IOperation[] = [ operation ];
	const consoleLogMock = jest.spyOn(console, 'log');
	const jsonStringifyMock = jest.spyOn(JSON, 'stringify').mockImplementationOnce(() => 'mocked value');
	const operations_class = new NotionOperationsClass({
		...returnDefaultOperationsClassArgs(),
		stack
	});
	operations_class.printStack();
	expect(jsonStringifyMock).toHaveBeenCalledWith(stack, null, 2);
	expect(consoleLogMock).toHaveBeenCalledTimes(1);
	expect(consoleLogMock).toHaveBeenCalledWith('mocked value');
});

it(`getPlugins`, () => {
	const removeLastEditedPropsFn = NotionOperationsPlugin.removeLastEditedProps();
	const operations_class = new NotionOperationsClass({
		...returnDefaultOperationsClassArgs(),
		notion_operation_plugins: [ removeLastEditedPropsFn ]
	});
	expect(operations_class.getPlugins()).toStrictEqual([ removeLastEditedPropsFn ]);
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

	const operations = new NotionOperationsClass({
		...returnDefaultOperationsClassArgs(),
		stack,
		notion_operation_plugins: [
			NotionOperationsPlugin.removeLastEditedProps(),
			NotionOperationsPlugin.removeEmptyOperations()
		]
	});

	const updated_operations = operations.applyPluginsToOperationsStack();

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
