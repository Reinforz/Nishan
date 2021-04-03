import { INotionEndpointsOptions } from '@nishans/endpoints';
import { ExportOptions } from '@nishans/types';
import { enqueueAndPollTask } from '../utils';

export const exportBlock = async (
	block_id: string,
	export_options: ExportOptions & { recursive: boolean },
	options: INotionEndpointsOptions
) => {
  const export_url: string | null = null;

	await enqueueAndPollTask(
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
      success: (task)=>export_url = task.
    },
		options
	);

  return export_url;
};
