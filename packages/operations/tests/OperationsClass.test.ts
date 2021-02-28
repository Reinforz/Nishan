import { NotionMutations } from '@nishans/endpoints';
import { IOperation } from '@nishans/types';
import { NotionOperationsClass, NotionOperationsPlugin } from '../libs';

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
		token: 'token',
		user_id: '123'
	};
};

describe('executeOperations', () => {
	it(`print to console if the stack is empty`, async () => {
		const consoleLogMock = jest.spyOn(console, 'log');
		const operations_class = new NotionOperationsClass(returnDefaultOperationsClassArgs());
		await operations_class.executeOperations([]);
		expect(consoleLogMock).toHaveBeenCalledWith(`The operation stack is empty`);
	});

	it(`executes operations`, async () => {
		const saveTransactionsMock = jest
			.spyOn(NotionMutations, 'saveTransactions')
			.mockImplementationOnce(async () => ({}));
		const stack: IOperation[] = [ operation ];
		const operations_class = new NotionOperationsClass(returnDefaultOperationsClassArgs());

		await operations_class.executeOperations(stack);
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
		notion_operation_plugins: [
			NotionOperationsPlugin.removeLastEditedProps(),
			NotionOperationsPlugin.removeEmptyOperations()
		]
	});

	const updated_operations = operations.applyPluginsToOperationsStack(stack);

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
