---
id: Getting Started
title: Getting Started
sidebar_label: Getting Started
slug: /
---

Since this repo has not been published as a package yet, please clone the repo and use it for you automation purpose.

## Cloning

1. Navigate to the directory you want to clone into
2. Type `git clone https://github.com/Nishan-Open-Source/Nishan.git`
3. Navigate to the created directory
4. run `npm i` to install all the dependencies
5. run `tsc` to compile the ts files to js
6. Now a new folder named `dist` will be created, which will contain all the javascript files.

## Initial Configurations

1. Please login to your notion account
2. Now open your browser devtools using appropriate shortcut, `Ctrl + shift + i` for chrome.
3. Navigate to the `Applications` panel.
4. Click on cookie drawer and select `https://www.notion.so/` to view all the cookie stored by notion client.
5. The only cookie that you'll need is the `token_v2`
6. Please copy it as it'll be used for auth purposes.

:::note
You should never reveal/disclose/share your token with anyone else. Please store the token as an environment variable to minimize accidental disclose.
:::

## First steps

```js
// Import from the dist folder
const Nishan = require("./dist");

(async(){
  const nishan = new Nishan({
    token: /* Paste your copied token here */,
    timeout: 500 /* Timeout between each request */,
    logger: undefined // undefined or a cb function that is passed method, subject and the subject id
  });
  const user = await nishan.getNotionUser((user)=>user.given_name === "Devon");
  const space = await user.getSpace((space)=>space.name === "My Notion");
  const page = await space.getRootPage((page)=>page.properties.title[0][0] === "My Page");
  await page.delete();
})()
```

Please refer to the api section to see all the methods available in the classes.