import axios from "axios";

import Cache from "./Cache";

import createTransaction from "../utils/createTransaction";
import { error } from "../utils/logs";
import { ICache, Operation, Request, TDataType } from "../types/types";
import { CreateSpaceParams, CreateSpaceResult, EnqueueTaskResult, FindUserResult, GetBackLinksForBlockResult, GetGenericEmbedBlockDataParams, GetGenericEmbedBlockDataResult, GetGoogleDriveAccountsResult, GetPublicPageDataParams, GetPublicPageDataResult, GetPublicSpaceDataParams, GetPublicSpaceDataResult, GetSpacesResult, GetSubscriptionDataParams, GetSubscriptionDataResult, GetUploadFileUrlParams, GetUploadFileUrlResult, InitializeGoogleDriveBlockParams, InitializeGoogleDriveBlockResult, InitializePageTemplateParams, InitializePageTemplateResult, INotionUser, InviteGuestsToSpaceParams, LoadBlockSubtreeParams, LoadBlockSubtreeResult, LoadPageChunkParams, LoadPageChunkResult, LoadUserContentResult, QueryCollectionParams, QueryCollectionResult, RecordMap, RemoveUsersFromSpaceParams, RemoveUsersFromSpaceResult, SetBookmarkMetadataParams, SyncRecordValuesParams, SyncRecordValuesResult, TEnqueueTaskParams } from "../types/api";
import { UpdateCacheManuallyParam } from "../types/function";

/**
 * A class containing all the api endpoints of Notion
 * @noInheritDoc
 */
export default class Getters extends Cache {
  token: string;
  interval: number;
  user_id: string;
  space_id: string;
  shard_id: number;
  headers: {
    headers: {
      cookie: string
    }
  };
  createTransaction: (operations: Operation[]) => Request

  constructor({ token, interval, user_id, shard_id, space_id, cache }: {
    token: string,
    user_id: string,
    shard_id: number;
    space_id: string;
    interval?: number,
    cache?: ICache
  }) {
    super(cache);
    this.token = token;
    this.interval = interval || 1000;
    this.user_id = user_id;
    this.headers = {
      headers: {
        cookie: `token_v2=${token}`
      }
    };
    this.shard_id = shard_id;
    this.space_id = space_id;
    this.createTransaction = createTransaction.bind(this, shard_id, space_id);
  }

  getProps() {
    return {
      token: this.token,
      interval: this.interval,
      user_id: this.user_id,
      shard_id: this.shard_id,
      space_id: this.space_id,
      cache: this.cache,
    }
  }

  async getPublicPageData(arg: GetPublicPageDataParams): Promise<GetPublicPageDataResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data } = await axios.post(
            'https://www.notion.so/api/v3/getPublicPageData',
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

  async getPublicSpaceData(arg: GetPublicSpaceDataParams): Promise<GetPublicSpaceDataResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data } = await axios.post(
            'https://www.notion.so/api/v3/getPublicSpaceData',
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

  async getSubscriptionData(arg: GetSubscriptionDataParams): Promise<GetSubscriptionDataResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data } = await axios.post(
            'https://www.notion.so/api/v3/getSubscriptionData',
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


  async removeUsersFromSpace(arg: RemoveUsersFromSpaceParams): Promise<RemoveUsersFromSpaceResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data } = await axios.post(
            'https://www.notion.so/api/v3/removeUsersFromSpace',
            arg,
            this.headers
          ) as { data: RemoveUsersFromSpaceResult };
          this.saveToCache(data.recordMap);
          resolve(data);
        } catch (err) {
          reject(error(err.response.data))
        }
      }, this.interval)
    });
  }

  async initializePageTemplate(arg: InitializePageTemplateParams): Promise<InitializePageTemplateResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data } = await axios.post(
            'https://www.notion.so/api/v3/initializePageTemplate',
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

  async loadBlockSubtree(arg: LoadBlockSubtreeParams): Promise<LoadBlockSubtreeResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data } = await axios.post(
            'https://www.notion.so/api/v3/loadBlockSubtree',
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

  async getAllSpaces(): Promise<GetSpacesResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data } = await axios.post(
            'https://www.notion.so/api/v3/getSpaces',
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

  async getGenericEmbedBlockData(arg: GetGenericEmbedBlockDataParams): Promise<GetGenericEmbedBlockDataResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data } = await axios.post(
            'https://www.notion.so/api/v3/getGenericEmbedBlockData',
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

  async getUploadFileUrl(arg: GetUploadFileUrlParams): Promise<GetUploadFileUrlResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data } = await axios.post(
            'https://www.notion.so/api/v3/getUploadFileUrl',
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

  async getGoogleDriveAccounts(): Promise<GetGoogleDriveAccountsResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data } = await axios.post(
            'https://www.notion.so/api/v3/getGoogleDriveAccounts',
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

  async initializeGoogleDriveBlock(arg: InitializeGoogleDriveBlockParams): Promise<InitializeGoogleDriveBlockResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data } = await axios.post(
            'https://www.notion.so/api/v3/initializeGoogleDriveBlock',
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

  async getBacklinksForBlock(blockId: string): Promise<GetBackLinksForBlockResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data, data: { recordMap } } = await axios.post(
            'https://www.notion.so/api/v3/getBacklinksForBlock',
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

  async inviteGuestsToSpace(arg: InviteGuestsToSpaceParams): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          await axios.post(
            'https://www.notion.so/api/v3/inviteGuestsToSpace',
            arg,
            this.headers
          );
          resolve()
        } catch (err) {
          reject(error(err.response.data))
        }
      }, this.interval)
    })
  }

  async findUser(email: string): Promise<INotionUser> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data: { value } } = await axios.post(
            'https://www.notion.so/api/v3/findUser',
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

  async createSpace(params: Partial<CreateSpaceParams>): Promise<CreateSpaceResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data, data: { recordMap } } = await axios.post(
            'https://www.notion.so/api/v3/createSpace',
            {
              ...params,
              planType: "personal",
              initialUseCases: []
            },
            {
              headers: {
                cookie: `token_v2=${this.token};notion_user_id=${this.user_id};`
              }
            }
          ) as { data: CreateSpaceResult };
          this.saveToCache(recordMap);
          resolve(data);
        } catch (err) {
          reject(error(err.response.data))
        }
      }, this.interval)
    })
  }

  async syncRecordValues(requests: SyncRecordValuesParams[]): Promise<SyncRecordValuesResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data, data: { recordMap } } = await axios.post(
            'https://www.notion.so/api/v3/syncRecordValues',
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

  async queryCollection(arg: QueryCollectionParams): Promise<QueryCollectionResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data, data: { recordMap } } = await axios.post(
            'https://www.notion.so/api/v3/queryCollection',
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

  async loadUserContent(): Promise<RecordMap> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const res = await axios.post(
            'https://www.notion.so/api/v3/loadUserContent', {}, this.headers
          ) as { data: LoadUserContentResult };
          this.saveToCache(res.data.recordMap);
          resolve(res.data.recordMap);
        } catch (err) {
          reject(error(err.response.data));
        }
      }, this.interval)
    })
  }

  async saveTransactions(Operations: Operation[]): Promise<RecordMap> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const res = await axios.post("https://www.notion.so/api/v3/saveTransactions", this.createTransaction(Operations), this.headers);
          resolve(res.data.recordMap);
        } catch (err) {
          reject(error(err.response.data));
        }
      }, this.interval)
    })
  }

  // ? TD:2:M Add task typedef
  // ? TD:2:M Add EnqueueTaskResult interface
  async enqueueTask(task: TEnqueueTaskParams): Promise<EnqueueTaskResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const res = await axios.post(
            'https://www.notion.so/api/v3/enqueueTask', {
            task
          }, this.headers);
          resolve(res.data);
        } catch (err) {
          reject(error(err.response.data));
        }
      }, this.interval)
    })
  }

  async loadPageChunk(arg: LoadPageChunkParams): Promise<RecordMap> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const res = await axios.post(
            'https://www.notion.so/api/v3/loadPageChunk',
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

  async setBookmarkMetadata(arg: SetBookmarkMetadataParams): Promise<undefined> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          await axios.post(
            'https://www.notion.so/api/v3/setBookmarkMetadata',
            arg,
            this.headers
          );
          resolve(undefined);
        } catch (err) {
          reject(error(err.response.data))
        }
      })
    })
  }

  async getBackLinksForBlock(blockId: string): Promise<GetBackLinksForBlockResult> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const res = await axios.post(
            'https://www.notion.so/api/v3/getBacklinksForBlock',
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
  async getTasks(taskIds: string[]): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const res = await axios.post(
            'https://www.notion.so/api/v3/getTasks',
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

  async updateCacheManually(arg: UpdateCacheManuallyParam) {
    const sync_record_values: SyncRecordValuesParams[] = [];
    arg.forEach((arg: string | [string, TDataType]) => {
      if (Array.isArray(arg)) sync_record_values.push({ id: arg[0], table: arg[1], version: 0 });
      else if (typeof arg === "string") sync_record_values.push({ id: arg, table: "block", version: 0 })
    })
    await this.syncRecordValues(sync_record_values);
  }
}