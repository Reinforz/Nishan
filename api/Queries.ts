import axios from "axios";
import colors from "colors";

import Cache from "./Cache";

import { error } from "../utils";
import { UpdateCacheManuallyParam, TDataType, FindUserResult, GetBackLinksForBlockResult, GetGenericEmbedBlockDataParams, GetGenericEmbedBlockDataResult, GetGoogleDriveAccountsResult, GetPublicPageDataParams, GetPublicPageDataResult, GetPublicSpaceDataParams, GetPublicSpaceDataResult, GetSpacesResult, GetSubscriptionDataParams, GetSubscriptionDataResult, GetUploadFileUrlParams, GetUploadFileUrlResult, InitializeGoogleDriveBlockParams, InitializeGoogleDriveBlockResult, InitializePageTemplateParams, InitializePageTemplateResult, INotionUser, LoadBlockSubtreeParams, LoadBlockSubtreeResult, LoadPageChunkParams, LoadPageChunkResult, LoadUserContentResult, QueryCollectionParams, QueryCollectionResult, RecordMap, SyncRecordValuesParams, SyncRecordValuesResult, GetUserTasksResult, GetUserSharedPagesResult, GetUserSharedPagesParams, GetPageVisitsParams, GetPageVisitsResult, Logger, NishanArg } from "../types";

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
  protected user_id: string;
  protected defaultExecutionState: boolean;

  constructor({ logger, token, interval, user_id, cache, defaultExecutionState }: Omit<NishanArg, "shard_id" | "space_id" | "id" | "stack" | "sync_records">) {
    super(cache);
    this.token = token;
    this.interval = interval || 1000;
    this.headers = {
      headers: {
        cookie: `token_v2=${token};notion_user_id=${user_id}`,
        ["x-notion-active-user-header"]: user_id
      }
    };
    this.user_id = user_id;
    this.logger = function (method, subject, id) {
      console.log(`${colors.red(method)} ${colors.green(subject)} ${colors.blue(id)}`);
    } || logger;
    this.defaultExecutionState = defaultExecutionState ?? true;
  }

  protected async getPageVisits(arg: GetPageVisitsParams): Promise<GetPageVisitsResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data } = await axios.post(
            `${this.BASE_NOTION_URL}/getPageVisits`,
            arg,
            this.headers
          ) as { data: GetPageVisitsResult };
          resolve(data);
        } catch (err) {
          reject(error(err.response.data))
        }
      }, this.interval)
    });
  }

  protected async getUserSharedPages(arg: GetUserSharedPagesParams): Promise<GetUserSharedPagesResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data } = await axios.post(
            `${this.BASE_NOTION_URL}/getUserSharedPages`,
            arg,
            this.headers
          ) as { data: GetUserSharedPagesResult };
          resolve(data);
        } catch (err) {
          reject(error(err.response.data))
        }
      }, this.interval)
    });
  }

  protected async getUserTasks(): Promise<GetUserTasksResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data } = await axios.post(
            `${this.BASE_NOTION_URL}/getUserTasks`,
            {},
            this.headers
          ) as { data: GetUserTasksResult };
          resolve(data);
        } catch (err) {
          reject(error(err.response.data))
        }
      }, this.interval)
    });
  }

  protected async getPublicPageData(arg: GetPublicPageDataParams): Promise<GetPublicPageDataResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data } = await axios.post(
            `${this.BASE_NOTION_URL}/getPublicPageData`,
            arg,
            this.headers
          ) as { data: GetPublicPageDataResult };
          resolve(data);
        } catch (err) {
          reject(error(err.response.data))
        }
      }, this.interval)
    });
  }

  protected async getPublicSpaceData(arg: GetPublicSpaceDataParams): Promise<GetPublicSpaceDataResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data } = await axios.post(
            `${this.BASE_NOTION_URL}/getPublicSpaceData`,
            arg,
            this.headers
          ) as { data: GetPublicSpaceDataResult };
          resolve(data);
        } catch (err) {
          reject(error(err.response.data))
        }
      }, this.interval)
    });
  }

  protected async getSubscriptionData(arg: GetSubscriptionDataParams): Promise<GetSubscriptionDataResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data } = await axios.post(
            `${this.BASE_NOTION_URL}/getSubscriptionData`,
            arg,
            this.headers
          ) as { data: GetSubscriptionDataResult };
          resolve(data);
        } catch (err) {
          reject(error(err.response.data))
        }
      }, this.interval)
    });
  }

  protected async initializePageTemplate(arg: InitializePageTemplateParams): Promise<InitializePageTemplateResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data } = await axios.post(
            `${this.BASE_NOTION_URL}/initializePageTemplate`,
            arg,
            this.headers
          ) as { data: InitializePageTemplateResult };
          this.saveToCache(data.recordMap);
          resolve(data);
        } catch (err) {
          reject(error(err.response.data))
        }
      }, this.interval)
    })
  }

  protected async loadBlockSubtree(arg: LoadBlockSubtreeParams): Promise<LoadBlockSubtreeResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data } = await axios.post(
            `${this.BASE_NOTION_URL}/loadBlockSubtree`,
            arg,
            this.headers
          ) as { data: LoadBlockSubtreeResult };
          this.saveToCache(data.subtreeRecordMap);
          resolve(data);
        } catch (err) {
          reject(error(err.response.data))
        }
      }, this.interval)
    })
  }

  protected async getAllSpaces(): Promise<GetSpacesResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data } = await axios.post(
            `${this.BASE_NOTION_URL}/getSpaces`,
            {},
            this.headers
          ) as { data: GetSpacesResult };
          Object.values(data).forEach(data => this.saveToCache(data));
          resolve(data);
        } catch (err) {
          reject(error(err.response.data))
        }
      }, this.interval)
    })
  }

  protected async getGenericEmbedBlockData(arg: GetGenericEmbedBlockDataParams): Promise<GetGenericEmbedBlockDataResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data } = await axios.post(
            `${this.BASE_NOTION_URL}/getGenericEmbedBlockData`,
            arg,
            this.headers
          ) as { data: GetGenericEmbedBlockDataResult };
          resolve(data);
        } catch (err) {
          reject(error(err.response.data))
        }
      }, this.interval)
    })
  }

  protected async getUploadFileUrl(arg: GetUploadFileUrlParams): Promise<GetUploadFileUrlResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data } = await axios.post(
            `${this.BASE_NOTION_URL}/getUploadFileUrl`,
            arg,
            this.headers
          ) as { data: GetUploadFileUrlResult };
          resolve(data)
        } catch (err) {
          reject(error(err.response.data))
        }
      }, this.interval)
    })
  }

  protected async getGoogleDriveAccounts(): Promise<GetGoogleDriveAccountsResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data } = await axios.post(
            `${this.BASE_NOTION_URL}/getGoogleDriveAccounts`,
            {},
            this.headers
          ) as { data: GetGoogleDriveAccountsResult };
          resolve(data);
        } catch (err) {
          reject(error(err.response.data))
        }
      }, this.interval)
    })
  }

  protected async initializeGoogleDriveBlock(arg: InitializeGoogleDriveBlockParams): Promise<InitializeGoogleDriveBlockResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data } = await axios.post(
            `${this.BASE_NOTION_URL}/initializeGoogleDriveBlock`,
            arg,
            this.headers
          ) as { data: InitializeGoogleDriveBlockResult };
          this.saveToCache(data.recordMap);
          resolve(data);
        } catch (err) {
          reject(error(err.response.data))
        }
      }, this.interval)
    })
  }

  protected async getBacklinksForBlock(blockId: string): Promise<GetBackLinksForBlockResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data, data: { recordMap } } = await axios.post(
            `${this.BASE_NOTION_URL}/getBacklinksForBlock`,
            { blockId },
            this.headers
          ) as { data: GetBackLinksForBlockResult };
          this.saveToCache(recordMap);
          resolve(data)
        } catch (err) {
          reject(error(err.response.data))
        }
      }, this.interval)
    })
  }

  protected async findUser(email: string): Promise<INotionUser> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data: { value } } = await axios.post(
            `${this.BASE_NOTION_URL}/findUser`,
            { email },
            this.headers
          ) as { data: FindUserResult };
          resolve(value.value)
        } catch (err) {
          reject(error(err.response.data))
        }
      }, this.interval)
    })
  }

  protected async syncRecordValues(requests: SyncRecordValuesParams[]): Promise<SyncRecordValuesResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data, data: { recordMap } } = await axios.post(
            `${this.BASE_NOTION_URL}/syncRecordValues`,
            {
              requests
            },
            this.headers
          ) as { data: SyncRecordValuesResult };
          this.saveToCache(recordMap);
          resolve(data);
        } catch (err) {
          reject(error(err.response.data))
        }
      }, this.interval)
    })
  }

  protected async queryCollection(arg: QueryCollectionParams): Promise<QueryCollectionResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data, data: { recordMap } } = await axios.post(
            `${this.BASE_NOTION_URL}/queryCollection`,
            arg,
            this.headers
          ) as { data: QueryCollectionResult };
          this.saveToCache(recordMap);
          resolve(data);
        } catch (err) {
          reject(error(err.response.data))
        }
      }, this.interval)
    })
  }

  protected async loadUserContent(): Promise<RecordMap> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const res = await axios.post(
            `${this.BASE_NOTION_URL}/loadUserContent`, {}, this.headers
          ) as { data: LoadUserContentResult };
          this.saveToCache(res.data.recordMap);
          resolve(res.data.recordMap);
        } catch (err) {
          reject(error(err.response.data));
        }
      }, this.interval)
    })
  }

  protected async loadPageChunk(arg: LoadPageChunkParams): Promise<RecordMap> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const res = await axios.post(
            `${this.BASE_NOTION_URL}/loadPageChunk`,
            arg,
            this.headers
          ) as { data: LoadPageChunkResult };
          this.saveToCache(res.data.recordMap);
          resolve(res.data.recordMap);
        } catch (err) {
          reject(error(err.response.data))
        }
      })
    })
  }

  protected async getBackLinksForBlock(blockId: string): Promise<GetBackLinksForBlockResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const res = await axios.post(
            `${this.BASE_NOTION_URL}/getBacklinksForBlock`,
            {
              blockId
            },
            this.headers
          ) as { data: GetBackLinksForBlockResult };
          this.saveToCache(res.data.recordMap);
          resolve(res.data);
        } catch (err) {
          reject(error(err.response.data))
        }
      }, this.interval)
    })
  }

  // ? TD:2:H GetTaskResult interface
  protected async getTasks(taskIds: string[]): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const res = await axios.post(
            `${this.BASE_NOTION_URL}/getTasks`,
            {
              taskIds
            },
            this.headers
          ) as { data: GetBackLinksForBlockResult };
          resolve(res.data);
        } catch (err) {
          reject(error(err.response.data))
        }
      }, this.interval)
    })
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