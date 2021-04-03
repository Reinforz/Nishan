import { INotionEndpointsOptions, NotionEndpoints } from '@nishans/endpoints';
import { NotionIdz } from '@nishans/idz';
import { EnqueueTaskPayload, GetTasksResponse } from '@nishans/types';

interface ITaskCbs {
	success: (task: GetTasksResponse['results'][0]) => any;
	failure: (task: GetTasksResponse['results'][0]) => any;
	in_progress: (task: GetTasksResponse['results'][0]) => any;
}

export const enqueueAndPollTask = async (
	id: string,
	task: EnqueueTaskPayload,
	cbs: ITaskCbs,
	options: INotionEndpointsOptions
) => {
	id = NotionIdz.Transform.toUuid(NotionIdz.Transform.toId(id));
	const { taskId } = await NotionEndpoints.Mutations.enqueueTask(task, options);

	let is_task_in_progress = true;

	while (!is_task_in_progress) {
		const { results } = await NotionEndpoints.Queries.getTasks({ taskIds: [ taskId ] }, options);
		if (results[0].eventName === task.task.eventName && results[0].state === 'success') {
			is_task_in_progress = false;
			cbs.success(results[0]);
		} else if (results[0].state === 'failure') {
			cbs.failure(results[0]);
		} else if (results[0].state === 'in_progress') {
			cbs.in_progress(results[0]);
		}
	}
};
