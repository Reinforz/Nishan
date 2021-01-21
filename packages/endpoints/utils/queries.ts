import { GetPageVisitsParams } from "@nishans/types";
import axios from "axios";

const BASE_NOTION_URL = "https://www.notion.so/api/v3"

export interface NotionHeaders{
  headers: {
    cookie: string,
    ["x-notion-active-user-header"]: string
  }
}

interface Configs{
  token: string,
  user_id: string,
  interval?: number
}

const returnPromise = <T>(url: string, arg: any, {token, user_id, interval}:Configs): Promise<T> => {
  const headers = {
    headers: {
      cookie: `token_v2=${token};notion_user_id=${user_id};`,
      ["x-notion-active-user-header"]: user_id
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

export async function getPageVisits(arg: GetPageVisitsParams, configs: Configs){
  return await returnPromise("getPageVisits", arg, configs)
}