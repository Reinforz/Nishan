<p align="center"><a href="https://https://nishan-docs.netlify.app/" target="_blank" rel="noopener noreferrer"><img width="125" src="https://github.com/Devorein/Nishan/blob/master/docs/static/img/root/logo.svg" alt="Nishan logo"></a></p>

<div align="center"> <h1>Nishan</h1> </div>
<div align="center"><b>An ecosystem of packages for notion written in typescript.</b></div>

</br>

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

<p align="center">
  <img src="https://img.shields.io/badge/Total%20Packages-32-%2371368a">
  <img src="https://img.shields.io/badge/Published%20Packages-20-%2311806a">
</p>

This monorepo contains/will contain the following packages and apps:-

## Packages

*   **`@nishans/cache`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/cache) [NPM](https://www.npmjs.com/package/@nishans/cache): A cache specially designed to retrieve and store notion data in memory
*   **`@nishans/cli`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/cli): A package to interact with `@nishans/core` from the terminal
*   **`@nishans/cms`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/cms): A cms for notion
*   **`@nishans/constants`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/constants) [NPM](https://www.npmjs.com/package/@nishans/constants): A small package for all notion specific constants
*   **`@nishans/core`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/core) [Docs](https://nishan-docs.netlify.app/docs/core) [NPM](https://www.npmjs.com/package/@nishans/core): Unofficial Notion api for node.js with all crud functionalities for Space, User, Block, Page and many more
*   **`@nishans/discord-bot`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/discord-bot): A general purpose discord bot for working with `@nishans/core` from the discord chat textbox
*   **`@nishans/endpoints`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/endpoints) [Docs](https://nishan-docs.netlify.app/docs/endpoints) [NPM](https://www.npmjs.com/package/@nishans/endpoints): A package to expose all notion endpoints for queries and mutations
*   **`@nishans/errors`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/errors) [NPM](https://www.npmjs.com/package/@nishans/errors): A small package containing various notion specific error classes
*   **`@nishans/export`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/export): A small package to export notion page and database with ease
*   **`@nishans/extract`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/extract) [NPM](https://www.npmjs.com/package/@nishans/extract): A small package to extract required notion data
*   **`@nishans/fabricator`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/fabricator) [NPM](https://www.npmjs.com/package/@nishans/fabricator): A package to generate notion blocks using a simple api
*   **`@nishans/graphql`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/graphql) [NPM](https://www.npmjs.com/package/@nishans/graphql): A graphql server for notion built using `@nishans/core`
*   **`@nishans/idz`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/idz) [NPM](https://www.npmjs.com/package/@nishans/idz): A small package to validate, generate and parse notion ids
*   **`@nishans/init`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/init) [NPM](https://www.npmjs.com/package/@nishans/init): A package to initialize notion view & block data
*   **`@nishans/inline-blocks`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/inline-blocks) [NPM](https://www.npmjs.com/package/@nishans/inline-blocks): Package providing an easy to use api to generate contents for notion inline blocks
*   **`@nishans/lineage`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/lineage) [NPM](https://www.npmjs.com/package/@nishans/lineage): A package to work with notion child data
*   **`@nishans/logger`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/logger) [NPM](https://www.npmjs.com/package/@nishans/logger): A logger built specifically for nishan ecosystem
*   **`@nishans/markdown`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/markdown) [Docs](https://nishan-docs.netlify.app/docs/markdown): A package to upload markdown content into notion
*   **`@nishans/notion-formula`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/notion-formula) [Docs](https://nishan-docs.netlify.app/docs/notion-formula) [NPM](https://www.npmjs.com/package/@nishans/notion-formula): A package to generate notion formula with ease
*   **`@nishans/operations`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/operations) [NPM](https://www.npmjs.com/package/@nishans/operations): A package to inspect, modify and store notion operations
*   **`@nishans/orm`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/orm): A package to use notion as a database by providing an easy to use orm api
*   **`@nishans/permissions`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/permissions) [NPM](https://www.npmjs.com/package/@nishans/permissions): A package to easily deal with notion permissions
*   **`@nishans/react-filters`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/react-filters): A react component that emulates notions advanced filter
*   **`@nishans/remark-notion`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/remark-notion): A remark plugin to support custom notion specific syntax for `@nishans/markdown` package
*   **`@nishans/schema-builder`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/schema-builder): A package to create notion collection schema painlessly
*   **`@nishans/sync`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/sync) [Docs](https://nishan-docs.netlify.app/docs/sync) [NPM](https://www.npmjs.com/package/@nishans/sync): A package to keep local notion data in sync with remote one by storing and restoring it
*   **`@nishans/traverser`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/traverser) [NPM](https://www.npmjs.com/package/@nishans/traverser): Traverse notion data with ease
*   **`@nishans/typegen`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/typegen): A package to automatically generate typescript definitions from a remote notion collection schema
*   **`@nishans/types`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/types) [Docs](https://nishan-docs.netlify.app/docs/types) [NPM](https://www.npmjs.com/package/@nishans/types): Typescript type definitions for notion
*   **`@nishans/upload`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/upload): A small package to upload content into notion
*   **`@nishans/utils`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/utils) [Docs](https://nishan-docs.netlify.app/docs/utils) [NPM](https://www.npmjs.com/package/@nishans/utils): A bunch of small utility modules used across nishans ecosystem
*   **`@nishans/validators`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/validators): A group of modules to validate various things related to notion

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
