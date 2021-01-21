import axios from "axios";

import Cache from "./Cache";

import { GetPageVisitsParams, GetPageVisitsResult, GetUserSharedPagesParams, GetUserSharedPagesResult, GetUserTasksResult, GetPublicPageDataParams, GetPublicPageDataResult, GetPublicSpaceDataParams, GetPublicSpaceDataResult, GetSubscriptionDataParams, GetSubscriptionDataResult, InitializePageTemplateParams, InitializePageTemplateResult, LoadBlockSubtreeParams, LoadBlockSubtreeResult, GetSpacesResult, GetGenericEmbedBlockDataParams, GetGenericEmbedBlockDataResult, GetUploadFileUrlParams, GetUploadFileUrlResult, GetGoogleDriveAccountsResult, InitializeGoogleDriveBlockParams, InitializeGoogleDriveBlockResult, GetBackLinksForBlockResult, FindUserResult, SyncRecordValuesParams, SyncRecordValuesResult, QueryCollectionParams, QueryCollectionResult, LoadUserContentResult, LoadPageChunkParams, LoadPageChunkResult, TDataType } from "@nishans/types";
import { Configs, CtorArgs, UpdateCacheManuallyParam } from "./types";
import { getPageVisits } from "../utils";

/**
 * A class containing all the api endpoints of Notion
 * @noInheritDoc
 */
export default class Queries extends Cache {
  token: string;
  interval: number;
  headers: {
    headers: {
      cookie: string,
      ["x-notion-active-user-header"]: string
    }
  };
  BASE_NOTION_URL = "https://www.notion.so/api/v3";
  user_id: string;

  constructor({ token, interval, user_id, cache }: Omit<CtorArgs, "shard_id" | "space_id">) {
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
  }

  returnPromise = <T>(url: string, arg?: any, keyToCache?: keyof T, interval?:number): Promise<T> => {
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
          reject(err.response.data)
        }
      }, interval ?? this.interval)
    });
  }

  #getConfigs = (): Configs => {
    return {
      token: this.token,
      user_id: this.user_id,
      interval: this.interval
    }
  }

  async getPageVisits(arg: GetPageVisitsParams) {
    return await getPageVisits(arg, this.#getConfigs());
  }

  async getUserSharedPages(arg: GetUserSharedPagesParams) {
    return this.returnPromise<GetUserSharedPagesResult>("getUserSharedPages", arg);
  }

  async getUserTasks(): Promise<GetUserTasksResult> {
    return this.returnPromise<GetUserTasksResult>("getUserTasks");
  }

  async getPublicPageData(arg: GetPublicPageDataParams) {
    return this.returnPromise<GetPublicPageDataResult>("getPublicPageData", arg);
  }

  async getPublicSpaceData(arg: GetPublicSpaceDataParams) {
    return this.returnPromise<GetPublicSpaceDataResult>("getPublicSpaceData", arg);
  }

  async getSubscriptionData(arg: GetSubscriptionDataParams) {
    return this.returnPromise<GetSubscriptionDataResult>("getSubscriptionData", arg);
  }

  async initializePageTemplate(arg: InitializePageTemplateParams) {
    return this.returnPromise<InitializePageTemplateResult>("initializePageTemplate", arg, "recordMap");
  }

  async loadBlockSubtree(arg: LoadBlockSubtreeParams) {
    return this.returnPromise<LoadBlockSubtreeResult>("loadBlockSubtree", arg, "subtreeRecordMap");
  }

  async getAllSpaces() {
    const data = await this.returnPromise<GetSpacesResult>("loadBlockSubtree");
    Object.values(data).forEach(data => this.saveToCache(data));
    return data;
  }

  async getGenericEmbedBlockData(arg: GetGenericEmbedBlockDataParams) {
    return this.returnPromise<GetGenericEmbedBlockDataResult>("getGenericEmbedBlockData", arg);
  }

  async getUploadFileUrl(arg: GetUploadFileUrlParams) {
    return this.returnPromise<GetUploadFileUrlResult>("getUploadFileUrl", arg);
  }

  async getGoogleDriveAccounts() {
    return this.returnPromise<GetGoogleDriveAccountsResult>("getGoogleDriveAccounts");
  }

  async initializeGoogleDriveBlock(arg: InitializeGoogleDriveBlockParams) {
    return this.returnPromise<InitializeGoogleDriveBlockResult>("initializeGoogleDriveBlock", arg, "recordMap");
  }

  async getBacklinksForBlock(blockId: string): Promise<GetBackLinksForBlockResult> {
    return this.returnPromise<GetBackLinksForBlockResult>("getBacklinksForBlock", { blockId }, "recordMap");
  }

  async findUser(email: string) {
    return this.returnPromise<FindUserResult>("findUser", { email });
  }

  async syncRecordValues(requests: SyncRecordValuesParams[], interval?:number) {
    return this.returnPromise<SyncRecordValuesResult>("syncRecordValues", { requests }, "recordMap", interval);
  }

  async queryCollection(arg: QueryCollectionParams, interval?:number) {
    return this.returnPromise<QueryCollectionResult>("queryCollection", arg, "recordMap", interval);
  }

  async loadUserContent() {
    return this.returnPromise<LoadUserContentResult>("loadUserContent", {}, "recordMap");
  }

  async loadPageChunk(arg: LoadPageChunkParams) {
    return this.returnPromise<LoadPageChunkResult>("loadPageChunk", arg, "recordMap");
  }

  // ? TD:2:H GetTaskResult interface
  async getTasks(taskIds: string[]) {
    return this.returnPromise<any>("getTasks", {
      taskIds
    });
  }

  async updateCacheManually(arg: UpdateCacheManuallyParam | string, interval?: number) {
    const sync_record_values: SyncRecordValuesParams[] = [];
    if (Array.isArray(arg))
      arg.forEach((arg: string | [string, TDataType]) => {
        if (Array.isArray(arg)) sync_record_values.push({ id: arg[0], table: arg[1], version: 0 });
        else if (typeof arg === "string") sync_record_values.push({ id: arg, table: "block", version: 0 })
      })
    else if (typeof arg === "string")
      sync_record_values.push({ id: arg, table: "block", version: 0 })
    return await this.syncRecordValues(sync_record_values, interval);
  }

  async updateCacheIfNotPresent(arg: UpdateCacheManuallyParam) {
    const sync_record_values: SyncRecordValuesParams[] = [];
    arg.forEach((arg: string | [string, TDataType]) => {
      if (Array.isArray(arg) && !this.cache[arg[1]].get(arg[0])) sync_record_values.push({ id: arg[0], table: arg[1], version: 0 });
      else if (typeof arg === "string" && !this.cache.block.get(arg)) sync_record_values.push({ id: arg, table: "block", version: 0 })
    })
    if (sync_record_values.length)
      await this.syncRecordValues(sync_record_values);
  }
}