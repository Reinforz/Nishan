import { INotionEndpointsOptions, NotionEndpoints } from '@nishans/endpoints';
import { NotionIdz } from '@nishans/idz';
import { ExportOptions } from '@nishans/types';

export const exportBlock = async (
	block_id: string,
	export_options: ExportOptions & { recursive: boolean },
	options: INotionEndpointsOptions
) => {
	block_id = NotionIdz.Transform.toUuid(NotionIdz.Transform.toId(block_id));
	const { taskId } = await NotionEndpoints.Mutations.enqueueTask(
		{
			task: {
				eventName: 'exportBlock',
				request: {
					blockId: block_id,
					exportOptions: export_options,
					recursive: export_options.recursive
				}
			}
		},
		options
	);
	let is_task_done = false,
		export_url = '';
	while (!is_task_done) {
		const { results } = await NotionEndpoints.Queries.getTasks({ taskIds: [ taskId ] }, { ...options, interval: 1000 });
		if (results[0].eventName === 'exportBlock' && results[0].state === 'success') {
			is_task_done = true;
			export_url = results[0].status.exportURL;
		}
	}
	return export_url;
};
