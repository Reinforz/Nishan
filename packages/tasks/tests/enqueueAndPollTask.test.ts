import { NotionEndpoints } from '@nishans/endpoints';
import { NotionTasks } from '../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

const arg = {
	task: {
		eventName: 'exportBlock',
		request: {
			blockId: 'block_1',
			exportOptions: {
				exportType: 'markdown',
				locale: 'en',
				timeZone: ''
			},
			recursive: true
		}
	}
} as any;

describe('enqueueAndPollTask', () => {
	it(`success`, async () => {
		jest.spyOn(NotionEndpoints.Mutations, 'enqueueTask').mockImplementationOnce(async () => ({ taskId: 'task_1' }));
		const getTasksMock = jest
			.spyOn(NotionEndpoints.Queries, 'getTasks')
			.mockImplementationOnce(async () => ({
				results: [
					{
						state: 'in_progress'
					} as any
				]
			}))
			.mockImplementationOnce(async () => ({
				results: [
					{
						state: 'success'
					} as any
				]
			}));

		await NotionTasks.enqueueAndPollTask(
			arg,
			{
				success: (response) => {
					expect(response).toStrictEqual({
						state: 'success'
					});
				},
				in_progress: (response) => {
					expect(response).toStrictEqual({
						state: 'in_progress'
					});
				}
			},
			{
				token: '',
				user_id: 'user_root_1'
			}
		);

		expect(getTasksMock.mock.calls[0][0]).toStrictEqual({ taskIds: [ 'task_1' ] });
		expect(getTasksMock.mock.calls[1][0]).toStrictEqual({ taskIds: [ 'task_1' ] });
		expect(getTasksMock).toHaveBeenCalledTimes(2);
	});

	it(`failure`, async () => {
		jest.spyOn(NotionEndpoints.Mutations, 'enqueueTask').mockImplementationOnce(async () => ({ taskId: 'task_1' }));
		const getTasksMock = jest
			.spyOn(NotionEndpoints.Queries, 'getTasks')
			.mockImplementationOnce(async () => ({
				results: [
					{
						state: 'in_progress'
					} as any
				]
			}))
			.mockImplementationOnce(async () => ({
				results: [
					{
						state: 'failure'
					} as any
				]
			}));

		await NotionTasks.enqueueAndPollTask(
			arg,
			{
				failure: (response) => {
					expect(response).toStrictEqual({
						state: 'failure'
					});
				}
			},
			{
				token: '',
				user_id: 'user_root_1'
			}
		);

		expect(getTasksMock.mock.calls[0][0]).toStrictEqual({ taskIds: [ 'task_1' ] });
		expect(getTasksMock.mock.calls[1][0]).toStrictEqual({ taskIds: [ 'task_1' ] });
		expect(getTasksMock).toHaveBeenCalledTimes(2);
	});
});
