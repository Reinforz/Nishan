import axios from "axios";

import { Configs, NotionHeaders } from "../src";

const BASE_NOTION_URL = "https://www.notion.so/api/v3"

/**
 * Construct notion specific headers using the configs passed
 * @param configs Notion specific data required to construct the header
 * @returns Notion specific header
 */
export function constructNotionHeaders(configs: Configs): NotionHeaders{
  const {token, user_id = ''} = configs;
  if(!token)
    throw new Error('Token not provided')
  return  {
    headers: {
      cookie: `token_v2=${token};notion_user_id=${user_id};`,
      ["x-notion-active-user-header"]: user_id
    }
  }
}

/**
 * Sends and returns a notion request
 * @param endpoint The endpoint to send the request to
 * @param arg The body required to pass alongside the request
 * @param configs The config required to construct notion header
 * @returns
 */
export function sendApiRequest<T>(endpoint: string, arg: any, configs: Configs ){
  const headers = constructNotionHeaders(configs)
  return axios.post<T>(
    `${BASE_NOTION_URL}/${endpoint}`,
    arg,
    headers
  );
}

export const sendRequest = <T>(endpoint: string, arg: any, configs: Configs): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const response = await sendApiRequest<T>(endpoint, arg, configs);
        resolve(response.data)
      } catch (err) {
        reject(err)
      }
    }, configs.interval ?? 500)
  });
}
