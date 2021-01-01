export type TExportType = "markdown" | "pdf" | "html";
export type TTaskType = "deleteSpace" | "exportBlock" | "duplicateBlock" | "exportSpace";

export interface EnqueueTaskParams {
  eventName: TTaskType
}

export interface DuplicateBlockTaskParams extends EnqueueTaskParams {
  eventName: "duplicateBlock",
  request: {
    sourceBlockId: string,
    targetBlockId: string,
    addCopyName: boolean
  }
}

export interface ExportOptions {
  exportType: TExportType,
  locale: "en",
  timeZone: string
}

export interface ExportBlockTaskParams extends EnqueueTaskParams {
  eventName: "exportBlock",
  request: {
    blockId: string,
    exportOptions: ExportOptions,
    recursive: boolean
  }
}

export interface ExportSpaceTaskParams extends EnqueueTaskParams {
  eventName: "exportSpace",
  request: {
    spaceId: string,
    exportOptions: ExportOptions,
  }
}

export interface DeleteSpaceTaskParams extends EnqueueTaskParams {
  eventName: "deleteSpace",
  request: {
    spaceId: string
  }
}

export type TEnqueueTaskParams = DuplicateBlockTaskParams | ExportBlockTaskParams | DeleteSpaceTaskParams;

export interface EnqueueTaskResult {
  taskId: string
}
