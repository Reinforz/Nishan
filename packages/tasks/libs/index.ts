import { enqueueAndPollTask } from './enqueueAndPollTask';
import { ExportTask } from './Export';
import { importFile } from './importFile';

export const NotionTasks = {
	Export: ExportTask,
	importFile,
	enqueueAndPollTask
};
