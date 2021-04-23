import { NotionOperations } from '@nishans/operations';
import { IOperation } from '@nishans/types';

afterEach(() => {
	jest.restoreAllMocks();
});

export const createExecuteOperationsMock = () => {
	const executeOperationsMock = jest
		.spyOn(NotionOperations, 'executeOperations')
		.mockImplementation(async () => undefined);

	return {
		executeOperationsMock,
		e1 (ops: IOperation[]) {
			expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual(ops);
		},
		e2 (ops: IOperation[]) {
			expect(executeOperationsMock.mock.calls[1][0]).toStrictEqual(ops);
		}
	};
};
