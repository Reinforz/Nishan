import { GetPageVisitsParams, GetPageVisitsResult, GetUserSharedPagesParams, GetUserSharedPagesResult, GetUserTasksResult, GetPublicPageDataParams, GetPublicPageDataResult, GetPublicSpaceDataParams, GetPublicSpaceDataResult, GetSubscriptionDataParams, GetSubscriptionDataResult, InitializePageTemplateParams, InitializePageTemplateResult, LoadBlockSubtreeParams, LoadBlockSubtreeResult, GetSpacesResult, GetGenericEmbedBlockDataParams, GetGenericEmbedBlockDataResult, GetUploadFileUrlParams, GetUploadFileUrlResult, GetGoogleDriveAccountsResult, InitializeGoogleDriveBlockParams, InitializeGoogleDriveBlockResult, GetBackLinksForBlockResult, FindUserResult, SyncRecordValuesParams, SyncRecordValuesResult, QueryCollectionParams, QueryCollectionResult, LoadUserContentResult, LoadPageChunkParams, LoadPageChunkResult, TDataType } from "@nishans/types";
import axios from "axios";

import { Configs, ConfigsWithoutUserid } from "../src";

const BASE_NOTION_URL = "https://www.notion.so/api/v3"

const returnPromise = <T>(url: string, arg: any, configs: Configs | ConfigsWithoutUserid): Promise<T> => {
  const {token, interval} = configs;
  const headers = {
    headers: {
      cookie: `token_v2=${token};notion_user_id=${(configs as Configs).user_id ?? ''};`,
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

export async function getPageVisits(arg: GetPageVisitsParams, configs: ConfigsWithoutUserid){
  return await returnPromise<GetPageVisitsResult>("getPageVisits", arg, configs)
}

export async function getUserSharedPages(arg: GetUserSharedPagesParams, configs: ConfigsWithoutUserid){
  return await returnPromise<GetUserSharedPagesResult>("getUserSharedPages", arg, configs);
}
