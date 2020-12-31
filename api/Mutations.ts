import axios from "axios";
import { Request, RemoveUsersFromSpaceResult, RemoveUsersFromSpaceParams, IOperation, NishanArg, SetPageNotificationsAsReadParams, SetSpaceNotificationsAsReadParams, CreateSpaceParams, CreateSpaceResult, EnqueueTaskResult, InviteGuestsToSpaceParams, SetBookmarkMetadataParams, TEnqueueTaskParams } from "../types";
import { createTransaction, error } from "../utils";
import Queries from "./Queries";

export default class Mutations extends Queries {
  protected space_id: string;
  protected shard_id: number;
  protected createTransaction: (operations: IOperation[]) => Request

  constructor({ cache, token, interval, logger, user_id, shard_id, space_id, defaultExecutionState }: NishanArg) {
    super({ logger, token, interval, user_id, cache, defaultExecutionState });
    this.shard_id = shard_id;
    this.space_id = space_id;
    this.createTransaction = createTransaction.bind(this, shard_id, space_id);
  }

  #returnPromise = <T>(url: string, arg: any): Promise<T> => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const { data } = await axios.post<T>(
            `${this.BASE_NOTION_URL}/${url}`,
            arg,
            this.headers
          );
          resolve(data)
        } catch (err) {
          reject(error(err.response.data))
        }
      }, this.interval)
    });
  }

  protected async setPageNotificationsAsRead(arg: SetPageNotificationsAsReadParams) {
    return this.#returnPromise('setPageNotificationsAsRead', arg);
  }

  protected async setSpaceNotificationsAsRead(arg: SetSpaceNotificationsAsReadParams) {
    return this.#returnPromise('setSpaceNotificationsAsRead', arg)
  }

  protected async removeUsersFromSpace(arg: RemoveUsersFromSpaceParams) {
    const response = await this.#returnPromise<RemoveUsersFromSpaceResult>('removeUsersFromSpace', arg)
    this.saveToCache(response.recordMap);
    return response;
  }

  protected async inviteGuestsToSpace(arg: InviteGuestsToSpaceParams) {
    return this.#returnPromise('inviteGuestsToSpace', arg);
  }

  protected async createSpace(arg: Partial<CreateSpaceParams>): Promise<CreateSpaceResult> {
    const response = await this.#returnPromise<CreateSpaceResult>('createSpace', {
      ...arg,
      planType: "personal",
      initialUseCases: []
    })
    this.saveToCache(response.recordMap);
    return response;
  }

  protected async saveTransactions(Operations: IOperation[]) {
    return this.#returnPromise('saveTransactions', this.createTransaction(Operations));
  }

  // ? TD:2:M Add task typedef
  // ? TD:2:M Add EnqueueTaskResult interface
  protected async enqueueTask(task: TEnqueueTaskParams) {
    return this.#returnPromise<EnqueueTaskResult>('enqueueTask', task);
  }

  protected async setBookmarkMetadata(arg: SetBookmarkMetadataParams) {
    return this.#returnPromise('setBookmarkMetadata', arg);
  }
}