import { IOperation } from '@nishans/types';
import { NotionOperationsClass, NotionOperationsObject, NotionOperationsPlugin } from '../libs';

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

it(`getPlugins`, () => {
	const removeLastEditedPropsFn = NotionOperationsPlugin.removeLastEditedProps();
	const operations_class = new NotionOperationsClass({
		...returnDefaultOperationsClassArgs(),
		notion_operation_plugins: [ removeLastEditedPropsFn ]
	});
	expect(operations_class.getPlugins()).toStrictEqual([ removeLastEditedPropsFn ]);
});

it(`applyPluginsToOperationsStack`, () => {
	const operations_class = new NotionOperationsClass(returnDefaultOperationsClassArgs());
	const applyPluginsToOperationsStackMock = jest
		.spyOn(NotionOperationsObject, 'applyPluginsToOperationsStack')
		.mockImplementationOnce(() => []);
	operations_class.applyPluginsToOperationsStack([ operation ]);
	expect(applyPluginsToOperationsStackMock).toHaveBeenCalledWith([ operation ], []);
});

it(`executeOperations`, () => {
	const operations_class = new NotionOperationsClass(returnDefaultOperationsClassArgs());
	const executeOperationsMock = jest
		.spyOn(NotionOperationsObject, 'executeOperations')
		.mockImplementationOnce(async () => undefined);
	operations_class.executeOperations([ operation ]);
	expect(executeOperationsMock).toHaveBeenCalledWith(
		[ operation ],
		{
			token: 'token',
			user_id: '123',
			interval: 0,
      notion_operation_plugins: [],
      shard_id: 123,
      space_id: 'space_1'
		},
	);
});
