import axios from "axios";

import { Configs, NotionHeaders } from "../src";

const BASE_NOTION_URL = "https://www.notion.so/api/v3"

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

export function sendApiRequest<T>(url: string, arg: any, configs: Configs ){
  const headers = constructNotionHeaders(configs)
  return axios.post<T>(
    `${BASE_NOTION_URL}/${url}`,
    arg,
    headers
  );
}

export const sendRequest = <T>(url: string, arg: any, configs: Configs): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const response = await sendApiRequest<T>(url, arg, configs);
        resolve(response.data)
      } catch (err) {
        reject(err)
      }
    }, configs.interval ?? 500)
  });
}
