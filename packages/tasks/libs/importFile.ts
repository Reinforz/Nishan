import { INotionEndpointsOptions } from '@nishans/endpoints';
import { TImportFileTaskPayload } from '@nishans/types';
import { NotionTasks } from '../libs';

export const importFile = async (
	request: TImportFileTaskPayload['task']['request'],
	options: INotionEndpointsOptions
) => {
	await NotionTasks.enqueueAndPollTask<'importFile'>(
		{
			task: {
				eventName: 'importFile',
				request
			} as any
		},
		{},
		options
	);
};
