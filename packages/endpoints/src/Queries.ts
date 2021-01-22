import Cache from "./Cache";

import { RecordPageVisitParams, GetTasksParams, GetUserNotificationsParams, SyncRecordValues, GetPageVisitsParams, GetBackLinksForBlockParams, GetUserSharedPagesParams, GetPublicPageDataParams, GetPublicSpaceDataParams, GetSubscriptionDataParams, LoadBlockSubtreeParams, GetGenericEmbedBlockDataParams, GetUploadFileUrlParams, SyncRecordValuesParams, QueryCollectionParams, LoadPageChunkParams, TDataType, FindUserParams } from "@nishans/types";
import { Configs, CtorArgs, UpdateCacheManuallyParam } from "./types";
import { findUser, getBacklinksForBlock, getGenericEmbedBlockData, getGoogleDriveAccounts, getJoinableSpaces, getPageVisits, getPublicPageData, getPublicSpaceData, getSpaces, getSubscriptionData, getTasks, getUploadFileUrl, getUserNotifications, getUserSharedPages, getUserTasks, isEmailEducation, isUserDomainJoinable, loadBlockSubtree, loadPageChunk, loadUserContent, queryCollection, recordPageVisit, syncRecordValues } from "../utils";

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
    return await getUserSharedPages(arg, this.#getConfigs());
  }

  async getUserTasks() {
    return await getUserTasks(this.#getConfigs());
  }

  async getPublicPageData(arg: GetPublicPageDataParams) {
    return await getPublicPageData(arg, this.#getConfigs());
  }

  async getPublicSpaceData(arg: GetPublicSpaceDataParams) {
    return await getPublicSpaceData(arg, this.#getConfigs());
  }

  async getSubscriptionData(arg: GetSubscriptionDataParams) {
    return await getSubscriptionData(arg, this.#getConfigs())
  }

  async loadBlockSubtree(arg: LoadBlockSubtreeParams) {
    const data = await loadBlockSubtree(arg, this.#getConfigs());
    this.saveToCache(data.subtreeRecordMap);
    return data;
  }

  async getSpaces() {
    const data = await getSpaces(this.#getConfigs());
    Object.values(data).forEach(data => this.saveToCache(data));
    return data;
  }

  async getGenericEmbedBlockData(arg: GetGenericEmbedBlockDataParams) {
    return await getGenericEmbedBlockData(arg,this.#getConfigs())
  }

  async getUploadFileUrl(arg: GetUploadFileUrlParams) {
    return await getUploadFileUrl(arg, this.#getConfigs())
  }

  async getGoogleDriveAccounts() {
    return await getGoogleDriveAccounts(this.#getConfigs());
  }

  async getBacklinksForBlock(params: GetBackLinksForBlockParams) {
    const data = await getBacklinksForBlock(params, this.#getConfigs());
    this.saveToCache(data.recordMap)
    return data;
  }

  async findUser(params: FindUserParams) {
    return await findUser(params, this.#getConfigs());
  }

  async syncRecordValues(params: SyncRecordValuesParams) {
    const data = await syncRecordValues(params, this.#getConfigs());
    this.saveToCache(data.recordMap)
    return data;
  }

  async queryCollection(params: QueryCollectionParams) {
    const data = await queryCollection(params, this.#getConfigs());
    this.saveToCache(data.recordMap)
    return data;
  }

  async loadUserContent() {
    const data = await loadUserContent(this.#getConfigs());
    this.saveToCache(data.recordMap)
    return data;
  }

  async loadPageChunk(params: LoadPageChunkParams) {
    const data = await loadPageChunk(params, this.#getConfigs());
    this.saveToCache(data.recordMap)
    return data;
  }

  async getJoinableSpaces(){
    return await getJoinableSpaces(this.#getConfigs());
  }

  async isUserDomainJoinable(){
    return await isUserDomainJoinable(this.#getConfigs());
  }

  async isEmailEducation(){
    return await isEmailEducation(this.#getConfigs())
  }

  async getUserNotifications(params: GetUserNotificationsParams){
    return await getUserNotifications(params, this.#getConfigs())
  }

  async getTasks(params: GetTasksParams) {
    return await getTasks(params, this.#getConfigs())
  }

  async recordPageVisit(params: RecordPageVisitParams){
    return await recordPageVisit(params, this.#getConfigs());
  }

  async updateCacheManually(arg: UpdateCacheManuallyParam | string) {
    const sync_record_values: SyncRecordValues[] = [];
    if (Array.isArray(arg))
      arg.forEach((arg: string | [string, TDataType]) => {
        if (Array.isArray(arg)) sync_record_values.push({ id: arg[0], table: arg[1], version: 0 });
        else if (typeof arg === "string") sync_record_values.push({ id: arg, table: "block", version: 0 })
      })
    else if (typeof arg === "string")
      sync_record_values.push({ id: arg, table: "block", version: 0 })
    return await this.syncRecordValues({requests: sync_record_values});
  }

  async updateCacheIfNotPresent(arg: UpdateCacheManuallyParam) {
    const sync_record_values: SyncRecordValues[] = [];
    arg.forEach((arg: string | [string, TDataType]) => {
      if (Array.isArray(arg) && !this.cache[arg[1]].get(arg[0])) sync_record_values.push({ id: arg[0], table: arg[1], version: 0 });
      else if (typeof arg === "string" && !this.cache.block.get(arg)) sync_record_values.push({ id: arg, table: "block", version: 0 })
    })
    if (sync_record_values.length)
      await this.syncRecordValues({requests: sync_record_values});
  }
}