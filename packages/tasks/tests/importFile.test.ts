import { NotionEndpoints } from '@nishans/endpoints';
import { NotionTasks } from '../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`importFile`, async () => {
	const enqueueTaskMock = jest
			.spyOn(NotionEndpoints.Mutations, 'enqueueTask')
			.mockImplementationOnce(async () => ({ taskId: '123' })),
		getTasksMock = jest
			.spyOn(NotionEndpoints.Queries, 'getTasks')
			.mockImplementationOnce(async () => ({
				results: [
					{
						eventName: 'exportBlock',
						state: 'in_progress'
					}
				] as any
			}))
			.mockImplementationOnce(async () => ({
				results: [
					{
						eventName: 'exportBlock',
						state: 'success',
						status: {
							exportURL: 'exportUrl'
						}
					}
				] as any
			}));

	const request = {
		fileName: 'file_name',
		fileURL: 'https://localhost:1003',
		importType: 'ReplaceBlock',
		pageId: 'block_1',
		spaceId: 'space_1'
	} as any;

	await NotionTasks.importFile(request, {
		token: 'token',
		user_id: 'user_1'
	});

	expect(enqueueTaskMock.mock.calls[0][0]).toStrictEqual({
		task: {
			eventName: 'importFile',
			request
		}
	});
	expect(getTasksMock).toHaveBeenCalledTimes(2);
	expect(getTasksMock.mock.calls[0][0]).toStrictEqual({
		taskIds: [ '123' ]
	});
});
