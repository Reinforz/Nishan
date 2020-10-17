import axios from "axios";

import Cache from "./Cache";

import createTransaction from "../utils/createTransaction";
import { error } from "../utils/logs";
import { LoadUserContentResult, Operation, RecordMap, Request } from "../types";

export default class Getter extends Cache {
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
  createTransaction: (operations: Operation[][]) => Request

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

  async saveTransactions(Operations: Operation[][]): Promise<RecordMap> {
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
}