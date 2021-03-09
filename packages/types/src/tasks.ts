import { BlockData } from './recordMap';

export type TExportType = 'markdown' | 'pdf' | 'html';
export type TTaskType = 'deleteSpace' | 'exportBlock' | 'duplicateBlock' | 'exportSpace' | 'renameGroup';
export type TaskState = 'in_progress' | 'success';

interface IEnqueueTaskPayload<T extends TTaskType, R> {
	task: {
		eventName: T;
		request: R;
	};
}

export type RenameGroupTaskPayload = IEnqueueTaskPayload<
	'renameGroup',
	{
		collectionId: string;
		property: string;
		oldValue: { type: 'multi_select' | 'select'; value: string };
		newValue: { type: 'multi_select' | 'select'; value: string };
	}
>;

export interface RenameGroupTaskResponse {
	results: {
		id: string;
		eventName: 'renameGroup';
		request: RenameGroupTaskPayload['task']['request'];
		actor: ITaskActor;
		state: 'success';
	}[];
}

export type DuplicateBlockTaskPayload = IEnqueueTaskPayload<
	'duplicateBlock',
	{
		sourceBlockId: string;
		targetBlockId: string;
		addCopyName: boolean;
	}
>;

export interface ITaskActor {
	table: 'notion_user';
	id: string;
}

export interface DuplicateBlockTaskSuccessResponse {
	results: {
		id: string;
		eventName: 'duplicateBlock';
		request: DuplicateBlockTaskPayload['task']['request'];
		actor: ITaskActor;
		state: 'success';
		status: {
			recordMap: {
				block: BlockData;
			};
		};
	}[];
}

export interface DuplicateBlockTaskInProgressResponse {
	results: {
		id: string;
		eventName: 'duplicateBlock';
		request: DuplicateBlockTaskPayload['task']['request'];
		actor: ITaskActor;
		state: 'in_progress';
	}[];
}

export type TDuplicateBlockTaskResponse = DuplicateBlockTaskInProgressResponse | DuplicateBlockTaskSuccessResponse;

export interface ExportOptions {
	exportType: TExportType;
	locale: 'en';
	timeZone: string;
}

export type ExportBlockTaskPayload = IEnqueueTaskPayload<
	'exportBlock',
	{
		blockId: string;
		exportOptions: ExportOptions;
		recursive: boolean;
	}
>;

export interface ExportBlockTaskInProgressResponse {
	results: {
		id: string;
		eventName: 'exportBlock';
		request: ExportBlockTaskPayload['task']['request'];
		actor: ITaskActor;
		state: 'in_progress';
	}[];
}

export interface ExportTaskSuccessResponseStatus {
	exportURL: string;
	type: 'complete';
	pagesExported: number;
}
export interface ExportBlockTaskSuccessResponse {
	results: {
		id: string;
		eventName: 'exportBlock';
		request: ExportBlockTaskPayload['task']['request'];
		actor: ITaskActor;
		state: 'success';
		status: ExportTaskSuccessResponseStatus;
	}[];
}

export type TExportBlockTaskResponse = ExportBlockTaskSuccessResponse | ExportBlockTaskInProgressResponse;
export type ExportSpaceTaskPayload = IEnqueueTaskPayload<
	'exportSpace',
	{
		spaceId: string;
		exportOptions: ExportOptions;
	}
>;

export interface ExportSpaceTaskInProgressResponse {
	results: {
		id: string;
		eventName: 'exportSpace';
		request: ExportSpaceTaskPayload['task']['request'];
		actor: ITaskActor;
		state: 'in_progress';
		status: {
			type: 'progress';
			pagesExported: number;
		};
	}[];
}

export interface ExportSpaceTaskSuccessResponse {
	results: {
		id: string;
		eventName: 'exportSpace';
		request: ExportSpaceTaskPayload['task']['request'];
		actor: ITaskActor;
		state: 'success';
		status: ExportTaskSuccessResponseStatus;
	}[];
}

export type TExportSpaceTaskResponse = ExportSpaceTaskSuccessResponse | ExportSpaceTaskInProgressResponse;

export type DeleteSpaceTaskPayload = IEnqueueTaskPayload<
	'deleteSpace',
	{
		spaceId: string;
	}
>;

export interface DeleteSpaceTaskInProgressResponse {
	actor: ITaskActor;
	eventName: 'deleteSpace';
	id: string;
	request: DeleteSpaceTaskPayload['task']['request'];
	state: 'in_progress';
}

export interface DeleteSpaceTaskSuccessResponse {
	actor: ITaskActor;
	eventName: 'deleteSpace';
	id: string;
	request: DeleteSpaceTaskPayload['task']['request'];
	state: 'success';
}

export type DeleteSpaceTaskResponse = DeleteSpaceTaskSuccessResponse | DeleteSpaceTaskInProgressResponse;

export type EnqueueTaskPayload =
	| RenameGroupTaskPayload
	| DuplicateBlockTaskPayload
	| ExportBlockTaskPayload
	| DeleteSpaceTaskPayload;

export interface EnqueueTaskResponse {
	taskId: string;
}

export type GetTasksResponse =
	| TDuplicateBlockTaskResponse
	| TExportBlockTaskResponse
	| TExportSpaceTaskResponse
	| DeleteSpaceTaskResponse
	| RenameGroupTaskResponse;
