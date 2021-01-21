import { GetPageVisitsParams, GetPageVisitsResult, GetUserSharedPagesParams, GetUserSharedPagesResult, GetUserTasksResult, GetPublicPageDataParams, GetPublicPageDataResult, GetPublicSpaceDataParams, GetPublicSpaceDataResult, GetSubscriptionDataParams, GetSubscriptionDataResult, InitializePageTemplateParams, InitializePageTemplateResult, LoadBlockSubtreeParams, LoadBlockSubtreeResult,  GetGenericEmbedBlockDataParams, GetGenericEmbedBlockDataResult, GetUploadFileUrlParams, GetUploadFileUrlResult, GetGoogleDriveAccountsResult, InitializeGoogleDriveBlockParams, InitializeGoogleDriveBlockResult, GetBackLinksForBlockResult, FindUserResult, SyncRecordValuesParams, SyncRecordValuesResult, QueryCollectionParams, QueryCollectionResult, LoadUserContentResult, LoadPageChunkParams, LoadPageChunkResult, TDataType, GetSpacesResult, GetBackLinksForBlockParams, FindUserParams } from "@nishans/types";
import axios from "axios";

import { Configs, ConfigsWithoutUserid } from "../src";

const BASE_NOTION_URL = "https://www.notion.so/api/v3"

const returnPromise = <T>(url: string, arg: any, configs: Configs | ConfigsWithoutUserid): Promise<T> => {
  const {token, interval} = configs;
  const headers = {
    headers: {
      cookie: `token_v2=${token}; notion_user_id=${(configs as Configs).user_id ?? ''};`,
      ["x-notion-active-user-header"]: (configs as Configs).user_id ?? ''
    }
  }

  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const { data } = await axios.post<T>(
          `${BASE_NOTION_URL}/${url}`,
          arg,
          headers
        );
        resolve(data)
      } catch (err) {
        reject(err.response.data)
      }
    }, interval ?? 500)
  });
}

export async function getPageVisits(params: GetPageVisitsParams, configs: ConfigsWithoutUserid){
  return await returnPromise<GetPageVisitsResult>("getPageVisits", params, configs)
}

export async function getUserSharedPages(params: GetUserSharedPagesParams, configs: ConfigsWithoutUserid){
  return await returnPromise<GetUserSharedPagesResult>("getUserSharedPages", params, configs);
}

export async function getUserTasks(configs: Configs){
  return await returnPromise<GetUserTasksResult>("getUserTasks", {}, configs);
}

export async function getPublicPageData(params: GetPublicPageDataParams, configs: ConfigsWithoutUserid){
  return await returnPromise<GetPublicPageDataResult>("getPublicPageData", params, configs)
}

export async function getPublicSpaceData(params: GetPublicSpaceDataParams, configs: ConfigsWithoutUserid){
  return await returnPromise<GetPublicSpaceDataResult>("getPublicSpaceData", params, configs);
}

export async function getSubscriptionData(params: GetSubscriptionDataParams, configs: ConfigsWithoutUserid){
  return await returnPromise<GetSubscriptionDataResult>("getSubscriptionData", params, configs);
}

// ? RF:1:E Goes to mutation
export async function initializePageTemplate(params: InitializePageTemplateParams, configs: Configs){
  return await returnPromise<InitializePageTemplateResult>("initializePageTemplate", params, configs);
}

export async function loadBlockSubtree(params: LoadBlockSubtreeParams, configs: ConfigsWithoutUserid){
  return await returnPromise<LoadBlockSubtreeResult>("loadBlockSubtree", params, configs);
}

export async function getSpaces(configs: ConfigsWithoutUserid){
  return await returnPromise<GetSpacesResult>("getSpaces", {}, configs);
}

export async function getGenericEmbedBlockData(params: GetGenericEmbedBlockDataParams,configs: ConfigsWithoutUserid){
  return await returnPromise<GetGenericEmbedBlockDataResult>("getGenericEmbedBlockData", params, configs)
}

export async function getUploadFileUrl(params: GetUploadFileUrlParams, configs: ConfigsWithoutUserid){
  return await returnPromise<GetUploadFileUrlResult>("getUploadFileUrl", params, configs);
}

export async function getGoogleDriveAccounts(configs: ConfigsWithoutUserid){
  return await returnPromise<GetGoogleDriveAccountsResult>("getGoogleDriveAccounts", {}, configs);
}

// Goes to mutation
export async function initializeGoogleDriveBlock(params: InitializeGoogleDriveBlockParams, configs: ConfigsWithoutUserid){
  return await returnPromise<InitializeGoogleDriveBlockResult>("initializeGoogleDriveBlock", params, configs);
}

export async function getBacklinksForBlock(params: GetBackLinksForBlockParams, configs: ConfigsWithoutUserid){
  return await returnPromise<GetBackLinksForBlockResult>("getBacklinksForBlock", params, configs);
}

export async function findUser(params: FindUserParams, configs: ConfigsWithoutUserid){
  return await returnPromise<FindUserResult>("findUser", params, configs);
}

export async function syncRecordValues(params: SyncRecordValuesParams, configs: ConfigsWithoutUserid) {
  return await returnPromise<SyncRecordValuesResult>("syncRecordValues", params, configs);
}

export async function queryCollection(params: QueryCollectionParams, configs: ConfigsWithoutUserid) {
  return await returnPromise<QueryCollectionResult>("queryCollection", params, configs);
}

export async function loadUserContent(configs: ConfigsWithoutUserid) {
  return await returnPromise<LoadUserContentResult>("loadUserContent", {}, configs);
}

export async function loadPageChunk(params: LoadPageChunkParams, configs: ConfigsWithoutUserid) {
  return await returnPromise<LoadPageChunkResult>("loadPageChunk", params, configs);
}
