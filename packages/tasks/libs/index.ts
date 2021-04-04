import { enqueueAndPollTask } from './enqueueAndPollTask';
import { ExportTask } from './Export';

export const NotionTasks = {
	Export: ExportTask,
	enqueueAndPollTask
};
