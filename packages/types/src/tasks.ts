import { BlockData } from './recordMap';

export type TExportType = 'markdown' | 'pdf' | 'html';
export type TTaskType = 'deleteSpace' | 'exportBlock' | 'duplicateBlock' | 'exportSpace';
export type TaskState = 'in_progress' | 'success';
export interface DuplicateBlockTaskParams {
	task: {
		eventName: 'duplicateBlock';
		request: {
			sourceBlockId: string;
			targetBlockId: string;
			addCopyName: boolean;
		};
	};
}

export interface ITaskActor {
	table: 'notion_user';
	id: string;
}

export interface DuplicateBlockTaskSuccessResult {
	results: {
		id: string;
		eventName: 'duplicateBlock';
		request: DuplicateBlockTaskParams['task']['request'];
		actor: ITaskActor;
		state: 'success';
		status: {
			recordMap: {
				block: BlockData;
			};
		};
	}[];
}

export interface DuplicateBlockTaskInProgressResult {
	results: {
		id: string;
		eventName: 'duplicateBlock';
		request: DuplicateBlockTaskParams['task']['request'];
		actor: ITaskActor;
		state: 'in_progress';
	}[];
}

export type TDuplicateBlockTaskResult = DuplicateBlockTaskInProgressResult | DuplicateBlockTaskSuccessResult;

export interface ExportOptions {
	exportType: TExportType;
	locale: 'en';
	timeZone: string;
}

export interface ExportBlockTaskParams {
	task: {
		eventName: 'exportBlock';
		request: {
			blockId: string;
			exportOptions: ExportOptions;
			recursive: boolean;
		};
	};
}

export interface ExportBlockTaskInProgressResult {
	results: {
		id: string;
		eventName: 'exportBlock';
		request: ExportBlockTaskParams['task']['request'];
		actor: ITaskActor;
		state: 'in_progress';
	}[];
}

export interface ExportTaskSuccessResultStatus {
	exportURL: string;
	type: 'complete';
	pagesExported: number;
}
export interface ExportBlockTaskSuccessResult {
	results: {
		id: string;
		eventName: 'exportBlock';
		request: ExportBlockTaskParams['task']['request'];
		actor: ITaskActor;
		state: 'success';
		status: ExportTaskSuccessResultStatus;
	}[];
}

export type TExportBlockTaskResult = ExportBlockTaskSuccessResult | ExportBlockTaskInProgressResult;
export interface ExportSpaceTaskParams {
	task: {
		eventName: 'exportSpace';
		request: {
			spaceId: string;
			exportOptions: ExportOptions;
		};
	};
}

export interface ExportSpaceTaskInProgressResult {
	results: {
		id: string;
		eventName: 'exportSpace';
		request: ExportSpaceTaskParams['task']['request'];
		actor: ITaskActor;
		state: 'in_progress';
		status: {
			type: 'progress';
			pagesExported: number;
		};
	}[];
}

export interface ExportSpaceTaskSuccessResult {
	results: {
		id: string;
		eventName: 'exportSpace';
		request: ExportSpaceTaskParams['task']['request'];
		actor: ITaskActor;
		state: 'success';
		status: ExportTaskSuccessResultStatus;
	}[];
}

export type TExportSpaceTaskResult = ExportSpaceTaskSuccessResult | ExportSpaceTaskInProgressResult;

export interface DeleteSpaceTaskParams {
	task: {
		eventName: 'deleteSpace';
		request: {
			spaceId: string;
		};
	};
}

export interface DeleteSpaceTaskInProgressResult {
	actor: ITaskActor;
	eventName: 'deleteSpace';
	id: string;
	request: DeleteSpaceTaskParams['task']['request'];
	state: 'in_progress';
}

export interface DeleteSpaceTaskSuccessResult {
	actor: ITaskActor;
	eventName: 'deleteSpace';
	id: string;
	request: DeleteSpaceTaskParams['task']['request'];
	state: 'success';
}

export type DeleteSpaceTaskResult = DeleteSpaceTaskSuccessResult | DeleteSpaceTaskInProgressResult;

export type EnqueueTaskParams = DuplicateBlockTaskParams | ExportBlockTaskParams | DeleteSpaceTaskParams;

export interface EnqueueTaskResult {
	taskId: string;
}

export type GetTasksResult =
	| TDuplicateBlockTaskResult
	| TExportBlockTaskResult
	| TExportSpaceTaskResult
	| DeleteSpaceTaskResult;
