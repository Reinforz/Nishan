import axios from "axios";

import Cache from "./Cache";

import createTransaction from "../utils/createTransaction";
import { error } from "../utils/logs";
import { BlockData, EnqueueTaskResult, GetBackLinksForBlockResult, LoadPageChunkParams, LoadPageChunkResult, LoadUserContentResult, Operation, OperationTable, QueryCollectionResult, RecordMap, Request, SyncRecordValuesResult } from "../types";

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
  // ? TD:1:M Add typedef for bounded createTransaction function
  createTransaction: (operations: Operation[]) => Request

  constructor({ token, interval, user_id, shard_id, space_id }: {
    token: string,
    user_id: string,
    shard_id: number;
    space_id: string;
    interval?: number,
  }) {
    super();
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
      cache: this.cache
    }
  }

  async getBacklinksForBlock(blockId: string): Promise<{ block: BlockData }> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data: { recordMap } } = await axios.post(
            'https://www.notion.so/api/v3/getBacklinksForBlock',
            { blockId },
            this.headers
          ) as { data: GetBackLinksForBlockResult };
          this.saveToCache(recordMap);
          resolve(recordMap)
        } catch (err) {
          reject(error(err.response.data))
        }
      }, this.interval)
    })
  }

  async syncRecordValues(requests: { id: string, table: OperationTable, version: number }[]): Promise<RecordMap> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data: { recordMap } } = await axios.post(
            'https://www.notion.so/api/v3/syncRecordValues',
            {
              requests
            },
            this.headers
          ) as { data: SyncRecordValuesResult };
          this.saveToCache(recordMap);
          resolve(recordMap);
        } catch (err) {
          reject(error(err.response.data))
        }
      }, this.interval)
    })
  }

  async queryCollection(collectionId: string, collectionViewId: string): Promise<RecordMap> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data: { recordMap } } = await axios.post(
            'https://www.notion.so/api/v3/queryCollection',
            {
              collectionId,
              collectionViewId,
              query: {},
              loader: {
                limit: 1000,
                searchQuery: '',
                type: 'table'
              }
            },
            this.headers
          ) as { data: QueryCollectionResult };
          this.saveToCache(recordMap);
          resolve(recordMap);
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
  async enqueueTask(task: any): Promise<EnqueueTaskResult> {
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

  async getBackLinksForBlock(blockId: string): Promise<{ block: BlockData }> {
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
          resolve(res.data.recordMap);
        } catch (err) {
          reject(error(err.response.data))
        }
      }, this.interval)
    })
  }

  // ? TD:2:H getTaskResult interface
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
}