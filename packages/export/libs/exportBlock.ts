import { INotionEndpointsOptions } from '@nishans/endpoints';
import { ExportOptions } from '@nishans/types';
import { exportData } from './utils';

export const exportBlock = async (
	block_id: string,
	export_options: ExportOptions & { recursive: boolean },
	options: INotionEndpointsOptions
) => {
	return await exportData(
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
		options
	);
};
