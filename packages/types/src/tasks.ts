export type TExportType = "markdown" | "pdf" | "html";
export type TTaskType = "deleteSpace" | "exportBlock" | "duplicateBlock" | "exportSpace";

export interface DuplicateBlockTaskParams {
  task:{
    eventName: "duplicateBlock",
    request: {
      sourceBlockId: string,
      targetBlockId: string,
      addCopyName: boolean
    }
  }
}

export interface ExportOptions {
  exportType: TExportType,
  locale: "en",
  timeZone: string
}

export interface ExportBlockTaskParams {
  task:{
    eventName: "exportBlock",
    request: {
      blockId: string,
      exportOptions: ExportOptions,
      recursive: boolean
    }
  }
}

export interface ExportSpaceTaskParams {
  task:{
    eventName: "exportSpace",
    request: {
      spaceId: string,
      exportOptions: ExportOptions,
    }
  }
}

export interface DeleteSpaceTaskParams {
  task:{
    eventName: "deleteSpace",
    request: {
      spaceId: string
    }
  }
}

export type TEnqueueTaskParams = DuplicateBlockTaskParams | ExportBlockTaskParams | DeleteSpaceTaskParams;

export interface EnqueueTaskResult {
  taskId: string
}
