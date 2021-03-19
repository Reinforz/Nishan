import { BlockData, RecordMap } from './recordMap';

export type TExportType = 'markdown' | 'pdf' | 'html';
export type TTaskType =
	| 'deleteSpace'
	| 'exportBlock'
	| 'importFile'
	| 'importEvernote'
	| 'duplicateBlock'
	| 'exportSpace'
	| 'renameGroup';
export type TaskState = 'in_progress' | 'success';

interface IEnqueueTaskPayload<T extends TTaskType, R> {
	task: {
		eventName: T;
		request: R;
	};
}

export type ImportFileMergeIntoCollectionTaskPayload = IEnqueueTaskPayload<
	'importFile',
	{
		importType: 'MergeIntoCollection';
		fileURL: string;
		fileName: string;
		collectionId: string;
	}
>;

export type ImportFileReplaceBlockTaskPayload = IEnqueueTaskPayload<
	'importFile',
	{
		fileName: string;
		fileURL: string;
		importType: 'ReplaceBlock';
		pageId: string;
		spaceId: string;
	}
>;

export type TImportFileTaskPayload = ImportFileMergeIntoCollectionTaskPayload | ImportFileReplaceBlockTaskPayload;

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
	id: string;
	eventName: 'renameGroup';
	request: RenameGroupTaskPayload['task']['request'];
	actor: ITaskActor;
	state: 'success';
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
}

export interface DuplicateBlockTaskInProgressResponse {
	id: string;
	eventName: 'duplicateBlock';
	request: DuplicateBlockTaskPayload['task']['request'];
	actor: ITaskActor;
	state: 'in_progress';
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

export type ImportEvernotePayload = IEnqueueTaskPayload<
	'importEvernote',
	{
		notebookId: string;
		blockId: string;
		timestamp: number;
		parentTable: 'block';
	}
>;

export type ImportEvernoteResponse = {
	id: string;
	eventName: 'importEvernote';
	request: ImportEvernotePayload['task']['request'];
	actor: ITaskActor;
	state: 'success';
	status: {
		'importedNotes': number;
		'totalNotes': number;
	};
};

export interface ExportBlockTaskInProgressResponse {
	id: string;
	eventName: 'exportBlock';
	request: ExportBlockTaskPayload['task']['request'];
	actor: ITaskActor;
	state: 'in_progress';
}

export interface ExportTaskSuccessResponseStatus {
	exportURL: string;
	type: 'complete';
	pagesExported: number;
}
export interface ExportBlockTaskSuccessResponse {
	id: string;
	eventName: 'exportBlock';
	request: ExportBlockTaskPayload['task']['request'];
	actor: ITaskActor;
	state: 'success';
	status: ExportTaskSuccessResponseStatus;
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
	id: string;
	eventName: 'exportSpace';
	request: ExportSpaceTaskPayload['task']['request'];
	actor: ITaskActor;
	state: 'in_progress';
	status: {
		type: 'progress';
		pagesExported: number;
	};
}

export interface ExportSpaceTaskSuccessResponse {
	id: string;
	eventName: 'exportSpace';
	request: ExportSpaceTaskPayload['task']['request'];
	actor: ITaskActor;
	state: 'success';
	status: ExportTaskSuccessResponseStatus;
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
	| TImportFileTaskPayload
	| ImportEvernotePayload
	| RenameGroupTaskPayload
	| DuplicateBlockTaskPayload
	| ExportBlockTaskPayload
	| ExportSpaceTaskPayload
	| DeleteSpaceTaskPayload
	| ExportBlockTaskPayload;

export interface EnqueueTaskResponse {
	taskId: string;
}

export interface ImportFileMergeIntoCollectionTaskResponse {
	actor: ITaskActor;
	eventName: 'importFile';
	id: string;
	request: ImportFileMergeIntoCollectionTaskPayload['task']['request'];
	state: 'success';
	status: {
		recordMap: Pick<RecordMap, 'collection'>;
	};
}

export interface ImportFileReplaceBlockTaskResponse {
	actor: ITaskActor;
	eventName: 'importFile';
	id: string;
	request: ImportFileReplaceBlockTaskPayload['task']['request'];
	state: 'success';
	status: {
		recordMap: Pick<RecordMap, 'block'>;
	};
}

export type TImportFileTaskResponse = ImportFileMergeIntoCollectionTaskResponse | ImportFileReplaceBlockTaskResponse;

export type GetTasksResponse = {
	results: (
		| TImportFileTaskResponse
		| TDuplicateBlockTaskResponse
		| TExportBlockTaskResponse
		| TExportSpaceTaskResponse
		| DeleteSpaceTaskResponse
		| RenameGroupTaskResponse
		| ImportEvernoteResponse)[];
};
