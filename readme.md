<p align="center"><a href="https://https://nishan-docs.netlify.app/" target="_blank" rel="noopener noreferrer"><img width="125" src="https://github.com/Devorein/Nishan/blob/master/docs/static/img/root/logo.svg" alt="Nishan logo"></a></p>

<p align="center">
  <a href="https://app.codecov.io/gh/Devorein/Nishan/branch/master"><img src="https://img.shields.io/codecov/c/github/devorein/Nishan?color=blue"/></a>
  <a href="https://github.com/Devorein/Nishan/actions?query=workflow%3A%22Lint%2C+Build+and+Test%22"><img src="https://github.com/devorein/nishan/workflows/Lint,%20Build%20and%20Test/badge.svg"/></a>
  <img src="https://img.shields.io/github/commit-activity/m/devorein/nishan?color=yellow" />
  <img src="https://img.shields.io/github/repo-size/devorein/nishan?style=flat-square&color=orange"/>
  <img src="https://img.shields.io/github/contributors/devorein/nishan?label=contributors&color=red"/>
</p>

<p align="center">
  <a href="https://discord.com/invite/SpwHCz8ysx">
    <img src="https://img.shields.io/discord/804219491763617842.svg?style=flat&label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2">
  </a>
</p>

<div align="center"> <h1>Nishan</h1> </div>
<div align="center"><b>An ecosystem of packages for notion written in typescript.</b></div>

***

This monorepo contains/will contain the following packages and apps:-

## Packages

*   **`@nishans/cache`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/cache) [NPM](https://www.npmjs.com/package/@nishans/cache) [Docs](https://nishan-docs.netlify.app/docs/cache): A cache specially designed to retrieve and store notion data in memory
*   **`@nishans/cli`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/cli) [Docs](https://nishan-docs.netlify.app/docs/cli): A package to interact with `@nishans/core` from the terminal
*   **`@nishans/constants`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/constants) [NPM](https://www.npmjs.com/package/@nishans/constants) [Docs](https://nishan-docs.netlify.app/docs/constants): A small package for all notion specific constants
*   **`@nishans/core`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/core) [NPM](https://www.npmjs.com/package/@nishans/core) [Docs](https://nishan-docs.netlify.app/docs/core): Unofficial Notion api for node.js with all crud functionalities for Space, User, Block, Page and many more
*   **`@nishans/discord-bot`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/discord-bot) [Docs](https://nishan-docs.netlify.app/docs/discord-bot): A general purpose discord bot for working with `@nishans/core` from the discord chat textbox
*   **`@nishans/endpoints`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/endpoints) [NPM](https://www.npmjs.com/package/@nishans/endpoints) [Docs](https://nishan-docs.netlify.app/docs/endpoints): A package to expose all notion endpoints for queries and mutations
*   **`@nishans/errors`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/errors) [NPM](https://www.npmjs.com/package/@nishans/errors) [Docs](https://nishan-docs.netlify.app/docs/errors): A small package containing various notion specific error classes
*   **`@nishans/export`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/export) [Docs](https://nishan-docs.netlify.app/docs/export): A small package to export notion page and database with ease
*   **`@nishans/fabricator`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/fabricator) [NPM](https://www.npmjs.com/package/@nishans/fabricator) [Docs](https://nishan-docs.netlify.app/docs/fabricator): A package to generate notion blocks using a simple api
*   **`@nishans/graphql`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/graphql) [NPM](https://www.npmjs.com/package/@nishans/graphql) [Docs](https://nishan-docs.netlify.app/docs/graphql): A graphql server for notion built using `@nishans/core`
*   **`@nishans/idz`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/idz) [NPM](https://www.npmjs.com/package/@nishans/idz) [Docs](https://nishan-docs.netlify.app/docs/idz): A small package to validate, generate and parse notion ids
*   **`@nishans/inline-blocks`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/inline-blocks) [NPM](https://www.npmjs.com/package/@nishans/inline-blocks) [Docs](https://nishan-docs.netlify.app/docs/inline-blocks): Package providing an easy to use api to generate contents for notion inline blocks
*   **`@nishans/logger`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/logger) [Docs](https://nishan-docs.netlify.app/docs/logger): A logger built specifically for nishan ecosystem
*   **`@nishans/markdown`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/markdown) [Docs](https://nishan-docs.netlify.app/docs/markdown): A package to upload markdown content into notion
*   **`@nishans/notion-formula`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/notion-formula) [NPM](https://www.npmjs.com/package/@nishans/notion-formula) [Docs](https://nishan-docs.netlify.app/docs/notion-formula): A package to generate notion formula with ease
*   **`@nishans/operations`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/operations) [NPM](https://www.npmjs.com/package/@nishans/operations) [Docs](https://nishan-docs.netlify.app/docs/operations): A package to inspect, modify and store notion operations
*   **`@nishans/orm`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/orm) [Docs](https://nishan-docs.netlify.app/docs/orm): A package to use notion as a database by providing an easy to use orm api
*   **`@nishans/permissions`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/permissions) [NPM](https://www.npmjs.com/package/@nishans/permissions) [Docs](https://nishan-docs.netlify.app/docs/permissions): A package to easily deal with notion permissions
*   **`@nishans/react-filters`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/react-filters) [Docs](https://nishan-docs.netlify.app/docs/react-filters): A react component that emulates notions advanced filter
*   **`@nishans/remark-notion`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/remark-notion) [Docs](https://nishan-docs.netlify.app/docs/remark-notion): A remark plugin to support custom notion specific syntax for `@nishans/markdown` package
*   **`@nishans/schema-builder`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/schema-builder) [Docs](https://nishan-docs.netlify.app/docs/schema-builder): A package to create notion collection schema painlessly
*   **`@nishans/sync`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/sync) [NPM](https://www.npmjs.com/package/@nishans/sync) [Docs](https://nishan-docs.netlify.app/docs/sync): A package to keep local notion data in sync with remote one by storing and restoring it
*   **`@nishans/typegen`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/typegen) [Docs](https://nishan-docs.netlify.app/docs/typegen): A package to automatically generate typescript definitions from a remote notion collection schema
*   **`@nishans/types`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/types) [NPM](https://www.npmjs.com/package/@nishans/types) [Docs](https://nishan-docs.netlify.app/docs/types): Typescript type definitions for notion
*   **`@nishans/utils`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/utils) [NPM](https://www.npmjs.com/package/@nishans/utils) [Docs](https://nishan-docs.netlify.app/docs/utils): A bunch of small utility modules used across nishans ecosystem

## Apps

A few apps built/that will be built using the above packages

1.  [markdown-web](https://github.com/Devorein/Nishan/tree/master/apps/markdown-web) (NSY): A react powered web app to upload markdown content as notion pages using `@nishans/markdown`
2.  [markdown-desktop](https://github.com/Devorein/Nishan/tree/master/apps/markdown-desktop) (NSY): An electron powered desktop app to upload markdown content as notion pages using `@nishans/markdown`
3.  [markdown-vscode](https://github.com/Devorein/Nishan/tree/master/apps/markdown-vscode) (NSY): A vscode extension to upload markdown content as notion pages using `@nishans/markdown`
4.  [markdown-native](https://github.com/Devorein/Nishan/tree/master/apps/markdown-native) (NSY): A react native powered mobile app to upload markdown content as notion pages using `@nishans/markdown`
5.  [notion-formula-web](https://github.com/Devorein/Nishan/tree/master/apps/notion-formula-web) (NSY): A react powered web app to view the generated notion formula ast from array, object or string representation using `@nishans/notion-formula` package

***NOTE***: The scope was originally named nishan, but unfortunately that name was already taken in npm. I'll use the term nishan everywhere except in case of the scope, where its nishans.

## Contributors

1.  Safwan Shaheer [github](https://github.com/Devorein) Author, Maintainer
2.  Matt Casey [github](https://github.com/mattcasey) Contributor

## How to contribute

1.  Clone the repo locally by typing `git clone https://github.com/Devorein/Nishan.git` on the terminal.
2.  Make sure you have yarn installed
3.  Install all the dependencies using `yarn install`.
4.  Run all the tests using `yarn test`.

Feel free to submit a pull request or open a new issue, contributions are more than welcome !!!

## Implementations in other languages

1.  Python: [notion-py](https://github.com/jamalex/notion-py)
2.  Go: [notionapi](https://github.com/kjk/notionapi)
3.  Ruby: [notion-ruby](https://github.com/danmurphy1217/notion-ruby)
4.  Kotlin: [notion-sdk-kotlin](https://github.com/notionsdk/notion-sdk-kotlin)

## Related Projects

1.  [react-notion-x](https://github.com/NotionX/react-notion-x) Fast and accurate React renderer for Notion. TS batteries included.
2.  [ntast](https://github.com/phuctm97/ntast) Notion Abstract Syntax Tree specification.
