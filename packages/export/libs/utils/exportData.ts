import { INotionEndpointsOptions, NotionEndpoints } from '@nishans/endpoints';
import { NotionIdz } from '@nishans/idz';
import { ExportBlockTaskPayload, ExportSpaceTaskPayload } from '@nishans/types';

export const exportData = async (
	id: string,
	task: ExportBlockTaskPayload | ExportSpaceTaskPayload,
	options: INotionEndpointsOptions
) => {
	id = NotionIdz.Transform.toUuid(NotionIdz.Transform.toId(id));
	const { taskId } = await NotionEndpoints.Mutations.enqueueTask(task, options);

	let is_task_done = false,
		export_url = '';
	while (!is_task_done) {
		const { results } = await NotionEndpoints.Queries.getTasks({ taskIds: [ taskId ] }, { ...options, interval: 1000 });
		if (results[0].eventName === task.task.eventName && results[0].state === 'success') {
			is_task_done = true;
			export_url = results[0].status.exportURL;
		}
	}
	return export_url;
};
