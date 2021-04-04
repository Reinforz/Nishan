import { INotionEndpointsOptions } from '@nishans/endpoints';
import { ExportOptions } from '@nishans/types';
import { NotionTasks } from '../';

export const exportSpace = async (
	space_id: string,
	export_options: ExportOptions,
	options: INotionEndpointsOptions
) => {
	let export_url = '';

	await NotionTasks.enqueueAndPollTask<'exportSpace'>(
		{
			task: {
				eventName: 'exportSpace',
				request: {
					spaceId: space_id,
					exportOptions: export_options
				}
			}
		},
		{
			success: (response) => (export_url = response.status.exportURL)
		},
		options
	);

	return export_url;
};
