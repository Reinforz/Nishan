import { ICollectionView, ICollectionViewPage, TBlock, ICollection, MediaFormat } from "./block";
import { Node, OperationTable, Permission, TaskType, ExportType, Cursor, BoardView, CalendarView, GalleryView, ListView, TableView, CreateProps, LastEditedProps, TLocale, Account, Token, GoogleDriveFile, TGenericEmbedBlockType } from "./types";

export interface LoadBlockSubtreeParams {
  blockId: string,
  shallow: boolean
}

export interface LoadBlockSubtreeResult {
  subtreeRecordMap: {
    block: BlockData
  }
}

export interface GetSpacesResult {
  [k: string]: RecordMap
}

export interface GetGenericEmbedBlockDataParams {
  pageWidth: number,
  source: string,
  type: TGenericEmbedBlockType
}

export interface GetGenericEmbedBlockDataResult {
  format: MediaFormat,
  properties: {
    source: string[][]
  },
  type: TGenericEmbedBlockType
}

export interface GetUploadFileUrlParams {
  bucket: "secure",
  contentType: string,
  name: string
}

export interface GetUploadFileUrlResult {
  signedGetUrl: string,
  signedPutUrl: string,
  url: string
}

export interface SetBookmarkMetadataParams {
  blockId: string,
  url: string
}

export interface QueryCollectionParams {
  collectionId: string,
  collectionViewId: string,
  query: {},
  loader: {
    limit: number,
    searchQuery: string,
    type: 'table'
  }
}

export interface GetGoogleDriveAccountsResult {
  accounts: Account[]
}

export interface InitializeGoogleDriveBlockParams {
  blockId: string,
  fileId: string,
  token: Token
}

export interface InitializeGoogleDriveBlockResult {
  file: GoogleDriveFile,
  recordMap: {
    block: BlockData
  }
}

export interface SyncRecordValuesParams {
  id: string,
  table: OperationTable,
  version: number
}

export interface InviteGuestsToSpaceParams {
  blockId: string,
  permissionItems: Permission[],
  spaceId: string
}
export interface FindUserResult {
  value: {
    role: "reader",
    value: INotionUser
  }
}

export interface CreateSpaceParams {
  icon: string,
  initialUseCases: string[],
  name: string,
  planType: "personal"
}

export interface CreateSpaceResult {
  recordMap: {
    space: SpaceData
  },
  spaceId: string
}

export interface QueryCollectionResult {
  recordMap: RecordMap
}

export interface LoadUserContentResult {
  recordMap: RecordMap
}

export interface GetUserSharePagesResult {
  pages: { id: string, spaceId: string }[],
  recordMap: {
    block: BlockData,
    space: SpaceData,
  }
}

export interface EnqueueTaskResult {
  taskId: string
}

export interface SyncRecordValuesResult {
  recordMap: RecordMap
}

export interface EnqueueTaskParams {
  eventName: TaskType
}

export interface DuplicateBlockTaskParams extends EnqueueTaskParams {
  eventName: "duplicateBlock",
  request: {
    sourceBlockId: string,
    targetBlockId: string,
    addCopyName: boolean
  }
}

export interface ExportBlockTaskParams extends EnqueueTaskParams {
  eventName: "exportBlock",
  request: {
    blockId: string,
    exportOptions: {
      exportType: ExportType,
      locale: "en",
      timeZone: string
    },
    recursive: boolean
  }
}

export interface DeleteSpaceTaskParams extends EnqueueTaskParams {
  eventName: "deleteSpace",
  request: {
    spaceId: string
  }
}

export type TEnqueueTaskParams = DuplicateBlockTaskParams | ExportBlockTaskParams | DeleteSpaceTaskParams;

export interface LoadPageChunkParams {
  chunkNumber: number,
  cursor: Cursor,
  limit: number,
  pageId: string,
  verticalColumns: boolean
}

export interface LoadPageChunkResult {
  cursor: Cursor,
  recordMap: RecordMap
}

export interface GetBackLinksForBlockResult {
  recordMap: {
    block: BlockData,
  }
}

export interface CollectionViewData {
  [key: string]: {
    role: 'editor',
    value: ICollectionView
  }
};

export interface CollectionViewPageData {
  [key: string]: {
    role: 'editor',
    value: ICollectionViewPage
  }
};

export interface BlockData {
  [key: string]: {
    role: 'editor',
    value: TBlock
  }
}

export interface SpaceData {
  [key: string]: {
    role: 'editor',
    value: ISpace
  }
}

export interface SpaceViewData {
  [key: string]: {
    role: 'editor',
    value: ISpaceView
  }
}

export interface CollectionData {
  [key: string]: {
    role: 'editor',
    value: ICollection
  }
}

export interface ViewData {
  [key: string]: {
    role: 'editor',
    value: TableView | ListView | BoardView | CalendarView | GalleryView
  }
}

export interface NotionUserData {
  [key: string]: {
    role: 'editor',
    value: INotionUser
  }
}

export interface UserRootData {
  [key: string]: {
    role: 'editor',
    value: UserRoot
  }
}

export interface UserSettingsData {
  [key: string]: {
    role: 'editor',
    value: IUserSettings
  }
}

export interface ISpace extends CreateProps, LastEditedProps {
  beta_enabled: boolean,
  icon: string,
  id: string,
  invite_link_code: string,
  invite_link_enabled: boolean,
  name: string,
  pages: string[],
  permissions: Permission[],
  plan_type: "personal",
  shard_id: number,
  version: number
}

export interface ISpaceView extends Node {
  created_getting_started: true,
  created_onboarding_templates: true,
  joined: boolean,
  notify_desktop: true,
  notify_email: true,
  notify_mobile: true,
  sidebar_hidden_templates: string[],
  space_id: string,
  visited_templated: string[],
  bookmarked_pages: string[],
}

export interface INotionUser {
  email: string,
  family_name: string,
  given_name: string,
  id: string,
  onboarding_completed: boolean,
  profile_photo: string,
  version: number
}

export interface UserRoot {
  id: string,
  space_views: string[],
  version: number,
  left_spaces: string[]
}

export interface IUserSettings {
  id: string,
  version: number,
  settings: IUserSettingsSettings
}

export interface IUserSettingsSettings {
  locale: TLocale,
  persona: 'personal',
  preferred_locale: TLocale,
  preferred_locale_origin: "autodetect",
  signup_time: number,
  start_day_of_week: number,
  time_zone: string,
  type: "personal",
  used_desktop_web_app: boolean
}

export interface RecordMap {
  block: BlockData,
  collection: CollectionData,
  collection_view: ViewData,
  space: SpaceData,
  notion_user: NotionUserData,
  space_view: SpaceViewData,
  user_root: UserRootData,
  user_settings: UserSettingsData,
}