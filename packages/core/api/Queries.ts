import axios from "axios";
import colors from "colors";

import Cache from "./Cache";

import { error } from "../utils";
import { UpdateCacheManuallyParam, TDataType, FindUserResult, GetBackLinksForBlockResult, GetGenericEmbedBlockDataParams, GetGenericEmbedBlockDataResult, GetGoogleDriveAccountsResult, GetPublicPageDataParams, GetPublicPageDataResult, GetPublicSpaceDataParams, GetPublicSpaceDataResult, GetSpacesResult, GetSubscriptionDataParams, GetSubscriptionDataResult, GetUploadFileUrlParams, GetUploadFileUrlResult, InitializeGoogleDriveBlockParams, InitializeGoogleDriveBlockResult, InitializePageTemplateParams, InitializePageTemplateResult, LoadBlockSubtreeParams, LoadBlockSubtreeResult, LoadPageChunkParams, LoadPageChunkResult, LoadUserContentResult, QueryCollectionParams, QueryCollectionResult, SyncRecordValuesParams, SyncRecordValuesResult, GetUserTasksResult, GetUserSharedPagesResult, GetUserSharedPagesParams, GetPageVisitsParams, GetPageVisitsResult, Logger, NishanArg } from "@nishan/types";

/**
 * A class containing all the api endpoints of Notion
 * @noInheritDoc
 */
export default class Queries extends Cache {
  protected token: string;
  protected interval: number;
  protected headers: {
    headers: {
      cookie: string,
      ["x-notion-active-user-header"]: string
    }
  };
  protected BASE_NOTION_URL = "https://www.notion.so/api/v3";
  protected logger: Logger;
  protected defaultExecutionState: boolean;
  user_id: string;

  constructor({ logger, token, interval, user_id, cache, defaultExecutionState }: Omit<NishanArg, "shard_id" | "space_id" | "id" | "stack" | "sync_records">) {
    super(cache);
    this.token = token;
    this.interval = interval || 1000;
    this.headers = {
      headers: {
        cookie: `token_v2=${token};notion_user_id=${user_id};`,
        ["x-notion-active-user-header"]: user_id,
      }
    };
    this.user_id = user_id;
    this.logger = function (method, subject, id) {
      console.log(`${colors.red(method)} ${colors.green(subject)} ${colors.blue(id)}`);
    } || logger;
    this.defaultExecutionState = defaultExecutionState ?? true;
  }

  protected returnPromise = <T>(url: string, arg?: any, keyToCache?: keyof T): Promise<T> => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data } = await axios.post<T>(
            `${this.BASE_NOTION_URL}/${url}`,
            arg ?? {},
            this.headers
          );
          if (keyToCache) this.saveToCache(data[keyToCache]);
          resolve(data)
        } catch (err) {
          reject(error(err.response.data))
        }
      }, this.interval)
    });
  }

  protected async getPageVisits(arg: GetPageVisitsParams) {
    return this.returnPromise<GetPageVisitsResult>("getPageVisits", arg);
  }

  protected async getUserSharedPages(arg: GetUserSharedPagesParams) {
    return this.returnPromise<GetUserSharedPagesResult>("getUserSharedPages", arg);
  }

  protected async getUserTasks(): Promise<GetUserTasksResult> {
    return this.returnPromise<GetUserTasksResult>("getUserTasks");
  }

  protected async getPublicPageData(arg: GetPublicPageDataParams) {
    return this.returnPromise<GetPublicPageDataResult>("getPublicPageData", arg);
  }

  protected async getPublicSpaceData(arg: GetPublicSpaceDataParams) {
    return this.returnPromise<GetPublicSpaceDataResult>("getPublicSpaceData", arg);
  }

  protected async getSubscriptionData(arg: GetSubscriptionDataParams) {
    return this.returnPromise<GetSubscriptionDataResult>("getSubscriptionData", arg);
  }

  protected async initializePageTemplate(arg: InitializePageTemplateParams) {
    return this.returnPromise<InitializePageTemplateResult>("initializePageTemplate", arg, "recordMap");
  }

  protected async loadBlockSubtree(arg: LoadBlockSubtreeParams) {
    return this.returnPromise<LoadBlockSubtreeResult>("loadBlockSubtree", arg, "subtreeRecordMap");
  }

  protected async getAllSpaces() {
    const data = await this.returnPromise<GetSpacesResult>("loadBlockSubtree");
    Object.values(data).forEach(data => this.saveToCache(data));
    return data;
  }

  protected async getGenericEmbedBlockData(arg: GetGenericEmbedBlockDataParams) {
    return this.returnPromise<GetGenericEmbedBlockDataResult>("getGenericEmbedBlockData", arg);
  }

  protected async getUploadFileUrl(arg: GetUploadFileUrlParams) {
    return this.returnPromise<GetUploadFileUrlResult>("getUploadFileUrl", arg);
  }

  protected async getGoogleDriveAccounts() {
    return this.returnPromise<GetGoogleDriveAccountsResult>("getGoogleDriveAccounts");
  }

  protected async initializeGoogleDriveBlock(arg: InitializeGoogleDriveBlockParams) {
    return this.returnPromise<InitializeGoogleDriveBlockResult>("initializeGoogleDriveBlock", arg, "recordMap");
  }

  protected async getBacklinksForBlock(blockId: string): Promise<GetBackLinksForBlockResult> {
    return this.returnPromise<GetBackLinksForBlockResult>("getBacklinksForBlock", { blockId }, "recordMap");
  }

  protected async findUser(email: string) {
    return this.returnPromise<FindUserResult>("findUser", { email });
  }

  protected async syncRecordValues(requests: SyncRecordValuesParams[]) {
    return this.returnPromise<SyncRecordValuesResult>("syncRecordValues", { requests }, "recordMap");
  }

  protected async queryCollection(arg: QueryCollectionParams) {
    return this.returnPromise<QueryCollectionResult>("queryCollection", arg, "recordMap");
  }

  protected async loadUserContent() {
    return this.returnPromise<LoadUserContentResult>("loadUserContent", {}, "recordMap");
  }

  protected async loadPageChunk(arg: LoadPageChunkParams) {
    return this.returnPromise<LoadPageChunkResult>("loadPageChunk", arg, "recordMap");
  }

  // ? TD:2:H GetTaskResult interface
  protected async getTasks(taskIds: string[]) {
    return this.returnPromise<any>("getTasks", {
      taskIds
    });
  }

  protected async updateCacheManually(arg: UpdateCacheManuallyParam | string) {
    const sync_record_values: SyncRecordValuesParams[] = [];
    if (Array.isArray(arg))
      arg.forEach((arg: string | [string, TDataType]) => {
        if (Array.isArray(arg)) sync_record_values.push({ id: arg[0], table: arg[1], version: 0 });
        else if (typeof arg === "string") sync_record_values.push({ id: arg, table: "block", version: 0 })
      })
    else if (typeof arg === "string")
      sync_record_values.push({ id: arg, table: "block", version: 0 })
    return await this.syncRecordValues(sync_record_values);
  }

  protected async updateCacheIfNotPresent(arg: UpdateCacheManuallyParam) {
    const sync_record_values: SyncRecordValuesParams[] = [];
    arg.forEach((arg: string | [string, TDataType]) => {
      if (Array.isArray(arg) && !this.cache[arg[1]].get(arg[0])) sync_record_values.push({ id: arg[0], table: arg[1], version: 0 });
      else if (typeof arg === "string" && !this.cache.block.get(arg)) sync_record_values.push({ id: arg, table: "block", version: 0 })
    })
    if (sync_record_values.length)
      await this.syncRecordValues(sync_record_values);
  }
}