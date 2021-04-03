import { RecordMap } from './recordMap';

export interface ITaskActor {
	table: 'notion_user';
	id: string;
}
export type TExportType = 'markdown' | 'pdf' | 'html';
export type TTaskEventName =
	| 'deleteSpace'
	| 'exportBlock'
	| 'importFile'
	| 'importEvernote'
	| 'duplicateBlock'
	| 'exportSpace'
	| 'renameGroup'
	| 'restoreSnapshot';

export type TTaskState = 'in_progress' | 'success' | 'failure';
export interface ExportTaskSuccessResponseStatus {
	exportURL: string;
	type: 'complete';
	pagesExported: number;
}
interface IEnqueueTaskPayload<T extends TTaskEventName, R> {
	task: {
		eventName: T;
		request: R;
	};
}

export type RestoreSnapshotTaskPayload = IEnqueueTaskPayload<
	'restoreSnapshot',
	{
		blockId: string;
		timestamp: string;
	}
>;

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

export type ExportBlockTaskPayload = IEnqueueTaskPayload<
	'exportBlock',
	{
		blockId: string;
		exportOptions: ExportOptions;
		recursive: boolean;
	}
>;

export type ImportEvernoteTaskPayload = IEnqueueTaskPayload<
	'importEvernote',
	{
		notebookId: string;
		blockId: string;
		timestamp: number;
		parentTable: 'block';
	}
>;

export type DuplicateBlockTaskPayload = IEnqueueTaskPayload<
	'duplicateBlock',
	{
		sourceBlockId: string;
		targetBlockId: string;
		addCopyName: boolean;
	}
>;
export type ExportSpaceTaskPayload = IEnqueueTaskPayload<
	'exportSpace',
	{
		spaceId: string;
		exportOptions: ExportOptions;
	}
>;

export type DeleteSpaceTaskPayload = IEnqueueTaskPayload<
	'deleteSpace',
	{
		spaceId: string;
	}
>;

export type EnqueueTaskPayload =
	| TImportFileTaskPayload
	| ImportEvernoteTaskPayload
	| RenameGroupTaskPayload
	| DuplicateBlockTaskPayload
	| ExportBlockTaskPayload
	| ExportSpaceTaskPayload
	| DeleteSpaceTaskPayload
	| ExportBlockTaskPayload
	| RestoreSnapshotTaskPayload;

// Responses

interface IEnqueueTaskResponse<E extends TTaskEventName, R, S extends TTaskState> {
	id: string;
	eventName: E;
	actor: ITaskActor;
	request: R;
	state: S;
}

type IRenameGroupTaskResponse<S extends TTaskState> = IEnqueueTaskResponse<
	'renameGroup',
	RenameGroupTaskPayload['task']['request'],
	S
>;

export type RenameGroupTaskSuccessResponse = IRenameGroupTaskResponse<'success'>;
export type RenameGroupTaskInProgressResponse = IRenameGroupTaskResponse<'in_progress'>;
export type RenameGroupTaskFailureResponse = IRenameGroupTaskResponse<'failure'>;
export type TRenameGroupTaskResponse =
	| RenameGroupTaskSuccessResponse
	| RenameGroupTaskInProgressResponse
	| RenameGroupTaskFailureResponse;

type IDuplicateBlockTaskResponse<S extends TTaskState> = IEnqueueTaskResponse<
	'duplicateBlock',
	DuplicateBlockTaskPayload['task']['request'],
	S
>;
export interface DuplicateBlockTaskSuccessResponse extends IDuplicateBlockTaskResponse<'success'> {
	status: {
		recordMap: Pick<RecordMap, 'block'>;
	};
}
export type DuplicateBlockTaskInProgressResponse = IDuplicateBlockTaskResponse<'in_progress'>;
export type DuplicateBlockTaskFailureResponse = IDuplicateBlockTaskResponse<'failure'>;
export type TDuplicateBlockTaskResponse =
	| DuplicateBlockTaskInProgressResponse
	| DuplicateBlockTaskSuccessResponse
	| DuplicateBlockTaskFailureResponse;

export interface ExportOptions {
	exportType: TExportType;
	locale: 'en';
	timeZone: string;
}

type IImportEvernoteTaskResponse<S extends TTaskState> = IEnqueueTaskResponse<
	'importEvernote',
	ImportEvernoteTaskPayload['task']['request'],
	S
>;
export interface ImportEvernoteTaskSuccessResponse extends IImportEvernoteTaskResponse<'success'> {
	status: {
		importedNotes: number;
		totalNotes: number;
	};
}
export type ImportEvernoteTaskInProgressResponse = IImportEvernoteTaskResponse<'in_progress'>;
export type ImportEvernoteTaskFailureResponse = IImportEvernoteTaskResponse<'failure'>;
export type TImportEvernoteTaskResponse =
	| ImportEvernoteTaskSuccessResponse
	| ImportEvernoteTaskInProgressResponse
	| ImportEvernoteTaskFailureResponse;

type IExportBlockTaskResponse<S extends TTaskState> = IEnqueueTaskResponse<
	'exportBlock',
	ExportBlockTaskPayload['task']['request'],
	S
>;
export interface ExportBlockTaskSuccessResponse extends IExportBlockTaskResponse<'success'> {
	status: ExportTaskSuccessResponseStatus;
}
export type ExportBlockTaskInProgressResponse = IExportBlockTaskResponse<'in_progress'>;
export type ExportBlockTaskFailureResponse = IExportBlockTaskResponse<'failure'>;
export type TExportBlockTaskResponse =
	| ExportBlockTaskSuccessResponse
	| ExportBlockTaskInProgressResponse
	| ExportBlockTaskFailureResponse;

type IExportSpaceTaskResponse<S extends TTaskState> = IEnqueueTaskResponse<
	'exportSpace',
	ExportSpaceTaskPayload['task']['request'],
	S
>;
export interface ExportSpaceTaskSuccessResponse extends IExportSpaceTaskResponse<'success'> {
	status: {
		exportURL: string;
		pagesExported: number;
		type: 'complete';
	};
}
export type ExportSpaceTaskInProgressResponse = IExportSpaceTaskResponse<'in_progress'> & {
	status: {
		exportURL: string;
		pagesExported: number;
		type: 'complete';
	};
};
export type ExportSpaceTaskFailureResponse = IExportSpaceTaskResponse<'failure'>;
export type TExportSpaceTaskResponse =
	| ExportSpaceTaskSuccessResponse
	| ExportSpaceTaskInProgressResponse
	| ExportSpaceTaskFailureResponse;

type IDeleteSpaceTaskResponse<S extends TTaskState> = IEnqueueTaskResponse<
	'deleteSpace',
	DeleteSpaceTaskPayload['task']['request'],
	S
>;
export type DeleteSpaceTaskSuccessResponse = IDeleteSpaceTaskResponse<'success'>;
export type DeleteSpaceTaskInProgressResponse = IDeleteSpaceTaskResponse<'in_progress'>;
export type DeleteSpaceTaskFailureResponse = IDeleteSpaceTaskResponse<'failure'>;
export type TDeleteSpaceTaskResponse =
	| DeleteSpaceTaskSuccessResponse
	| DeleteSpaceTaskInProgressResponse
	| DeleteSpaceTaskFailureResponse;

type IImportFileMergeIntoCollectionTaskResponse<S extends TTaskState> = IEnqueueTaskResponse<
	'importFile',
	ImportFileMergeIntoCollectionTaskPayload['task']['request'],
	S
>;
export type ImportFileMergeIntoCollectionTaskSuccessResponse = IImportFileMergeIntoCollectionTaskResponse<'success'> & {
	status: {
		recordMap: Pick<RecordMap, 'collection'>;
	};
};
export type ImportFileMergeIntoCollectionTaskInProgressResponse = IImportFileMergeIntoCollectionTaskResponse<
	'in_progress'
>;
export type ImportFileMergeIntoCollectionTaskFailureResponse = IImportFileMergeIntoCollectionTaskResponse<'failure'>;
export type TImportFileMergeIntoCollectionTaskResponse =
	| ImportFileMergeIntoCollectionTaskSuccessResponse
	| ImportFileMergeIntoCollectionTaskInProgressResponse
	| ImportFileMergeIntoCollectionTaskFailureResponse;

type IImportFileReplaceBlockTaskResponse<S extends TTaskState> = IEnqueueTaskResponse<
	'importFile',
	ImportFileReplaceBlockTaskPayload['task']['request'],
	S
>;
export type ImportFileReplaceBlockTaskSuccessResponse = IImportFileReplaceBlockTaskResponse<'success'> & {
	status: {
		recordMap: Pick<RecordMap, 'block'>;
	};
};
export type ImportFileReplaceBlockTaskInProgressResponse = IImportFileReplaceBlockTaskResponse<'in_progress'>;
export type ImportFileReplaceBlockTaskFailureResponse = IImportFileReplaceBlockTaskResponse<'failure'>;
export type TImportFileReplaceBlockTaskResponse =
	| ImportFileReplaceBlockTaskSuccessResponse
	| ImportFileReplaceBlockTaskInProgressResponse
	| ImportFileReplaceBlockTaskFailureResponse;

export type TImportFileTaskResponse = TImportFileMergeIntoCollectionTaskResponse | TImportFileReplaceBlockTaskResponse;

type IRestoreSnapshotTaskResponse<S extends TTaskState> = IEnqueueTaskResponse<
	'restoreSnapshot',
	RestoreSnapshotTaskPayload['task']['request'],
	S
>;
export type RestoreSnapshotTaskSuccessResponse = IRestoreSnapshotTaskResponse<'success'>;
export type RestoreSnapshotTaskInProgressResponse = IRestoreSnapshotTaskResponse<'in_progress'>;
export type RestoreSnapshotTaskFailureResponse = IRestoreSnapshotTaskResponse<'failure'>;
export type TRestoreSnapshotTaskResponse =
	| RestoreSnapshotTaskSuccessResponse
	| RestoreSnapshotTaskInProgressResponse
	| RestoreSnapshotTaskFailureResponse;

export type GetTasksResponse = {
	results: (
		| TImportFileTaskResponse
		| TDuplicateBlockTaskResponse
		| TExportBlockTaskResponse
		| TExportSpaceTaskResponse
		| TDeleteSpaceTaskResponse
		| TRenameGroupTaskResponse
		| TImportEvernoteTaskResponse
		| TRestoreSnapshotTaskResponse)[];
};

export interface EnqueueTaskResponse {
	taskId: string;
}

export interface IEnqueueTaskBuilder<P, SR, IPR, FR> {
	payload: P;
	response: {
		success: SR;
		in_progress: IPR;
		failure: FR;
	};
}
export interface IEnqueueTask {
	deleteSpace: IEnqueueTaskBuilder<
		DeleteSpaceTaskPayload,
		DeleteSpaceTaskSuccessResponse,
		DeleteSpaceTaskInProgressResponse,
		DeleteSpaceTaskFailureResponse
	>;
	exportBlock: IEnqueueTaskBuilder<
		ExportBlockTaskPayload,
		ExportBlockTaskSuccessResponse,
		ExportBlockTaskInProgressResponse,
		ExportBlockTaskFailureResponse
	>;
	importFile: IEnqueueTaskBuilder<
		TImportFileTaskPayload,
		ImportFileMergeIntoCollectionTaskSuccessResponse | ImportFileReplaceBlockTaskSuccessResponse,
		ImportFileMergeIntoCollectionTaskInProgressResponse | ImportFileReplaceBlockTaskInProgressResponse,
		ImportFileMergeIntoCollectionTaskFailureResponse | ImportFileReplaceBlockTaskFailureResponse
	>;
	importEvernote: IEnqueueTaskBuilder<
		ImportEvernoteTaskPayload,
		ImportEvernoteTaskSuccessResponse,
		ImportEvernoteTaskInProgressResponse,
		ImportEvernoteTaskFailureResponse
	>;
	duplicateBlock: IEnqueueTaskBuilder<
		DuplicateBlockTaskPayload,
		DuplicateBlockTaskSuccessResponse,
		DuplicateBlockTaskInProgressResponse,
		DuplicateBlockTaskFailureResponse
	>;
	exportSpace: IEnqueueTaskBuilder<
		ExportSpaceTaskPayload,
		ExportSpaceTaskSuccessResponse,
		ExportSpaceTaskInProgressResponse,
		ExportSpaceTaskFailureResponse
	>;
	renameGroup: IEnqueueTaskBuilder<
		RenameGroupTaskPayload,
		RenameGroupTaskSuccessResponse,
		RenameGroupTaskInProgressResponse,
		RenameGroupTaskFailureResponse
	>;
	restoreSnapshot: IEnqueueTaskBuilder<
		RestoreSnapshotTaskPayload,
		RestoreSnapshotTaskSuccessResponse,
		RestoreSnapshotTaskInProgressResponse,
		RestoreSnapshotTaskFailureResponse
	>;
}
