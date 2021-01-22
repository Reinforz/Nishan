import axios from "axios";

import { Configs } from "../src";

const BASE_NOTION_URL = "https://www.notion.so/api/v3"

export const sendRequest = <T>(url: string, arg: any, configs: Configs): Promise<T> => {
  const {token, interval} = configs;
  const headers = {
    headers: {
      cookie: `token_v2=${token}; notion_user_id=${configs.user_id ?? ''};`,
      ["x-notion-active-user-header"]: configs.user_id ?? ''
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
