import { INotionEndpointsOptions } from '@nishans/endpoints';
import { ExportOptions } from '@nishans/types';
import { enqueueAndPollTask } from '../utils';

export const exportBlock = async (
	block_id: string,
	export_options: ExportOptions & { recursive: boolean },
	options: INotionEndpointsOptions
) => {
	let export_url = '';

	await enqueueAndPollTask<'exportBlock'>(
		block_id,
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
		{
			success: (response) => {
				export_url = response.status.exportURL;
			}
		},
		options
	);

	return export_url;
};
