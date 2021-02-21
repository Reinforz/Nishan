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

# Nishan

An ecosystem of packages for notion written in typescript.

This monorepo contains/will contain the following packages:-

## Packages

Legend:

1. NPM: Packages released in npm
2. WIP: Packages under heavy construction
3. NSY: Package development not started yet

---

1. **`@nishans/core`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/core) [NPM](https://www.npmjs.com/package/@nishans/core) [Docs](https://nishan-docs.netlify.app/docs/core/): Core package for nishan with all crud api
2. **`@nishans/types`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/types) [NPM](https://www.npmjs.com/package/@nishans/types) [Docs](https://nishan-docs.netlify.app/docs/types): Typescript typings for Notion only
3. **`@nishans/utils`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/utils) [NPM](https://www.npmjs.com/package/@nishans/utils) [Docs](https://nishan-docs.netlify.app/docs/utils): Utility package to make working with notion easier
4. **`@nishans/sync`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/sync) [NPM](https://www.npmjs.com/package/@nishans/sync) [Docs](https://nishan-docs.netlify.app/docs/sync): A package to keep remote notion data in sync with local data stored in mongodb or in a file, by downloading remote data locally and restoring notion using local data.
5. **`@nishans/graphql`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/graphql) (NSY): A graphql server and client UI to make working with nishan a breeze
6. **`@nishans/cli`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/cli) (NSY): A package to interact with the nishan api from the terminal
7. **`@nishans/typegen`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/typegen) (NSY): A package to automatically generate typescript definitions from a remote notion collection schema
8. **`@nishans/orm`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/orm) (NSY): A package to use notion as a database by providing an easy to use orm api
9. **`@nishans/endpoints`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/endpoints) [NPM](https://www.npmjs.com/package/@nishans/endpoints) [Docs](https://nishan-docs.netlify.app/docs/endpoints): A package to expose all notion endpoints for queries and mutations
10. **`@nishans/react-filters`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/react-filters) (WIP): A react component that emulates notions advanced filter
11. **`@nishans/markdown`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/markdown) (WIP): A package to upload markdown content into notion
12. **`@nishans/remark-notion`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/remark-notion) (WIP): A remark plugin to support custom notion specific syntax for `@nishans/markdown` package
13. **`@nishans/discord-bot`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/discord-bot) (NSY): A general purpose discord bot for working with `@nishans/core` from the discord chat textbox
14. **`@nishans/notion-formula`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/notion-formula) [NPM](https://www.npmjs.com/package/@nishans/notion-formula) [Docs](https://nishan-docs.netlify.app/docs/notion-formula/): A package to generate notion formula with ease
15. **`@nishans/schema`**-builder [Github](https://github.com/Devorein/Nishan/tree/master/packages/schema-builder) (NSY): A package to create notion collection schema painlessly
16. **`@nishans/cache`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/cache) [NPM](https://www.npmjs.com/package/@nishans/cache) [Docs](https://nishan-docs.netlify.app/docs/cache/): A cache specially designed to retrieve and store notion data in memory.
17. **`@nishans/operations`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/operations) [NPM](https://www.npmjs.com/package/@nishans/operations) [Docs](https://nishan-docs.netlify.app/docs/operations/): A package to inspect, modify and store notion operations.
18. **`@nishans/inline-blocks`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/inline-blocks) [NPM](https://www.npmjs.com/package/@nishans/inline-blocks) [Docs](https://nishan-docs.netlify.app/docs/inline-blocks/): Package providing an easy to use api to generate contents for notion inline blocks.
19. **`@nishans/idz`** [Github](https://github.com/Devorein/Nishan/tree/master/packages/idz) [NPM](https://www.npmjs.com/package/@nishans/idz) [Docs](https://nishan-docs.netlify.app/docs/idz/): A small package to validate, generate and parse notion ids.

### Apps

A few apps built using the above packages

1. [markdown-web](https://github.com/Devorein/Nishan/tree/master/apps/markdown-web) (NSY): A react powered web app to upload markdown content as notion pages using `@nishans/markdown`
2. [markdown-desktop](https://github.com/Devorein/Nishan/tree/master/apps/markdown-desktop) (NSY): An electron powered desktop app to upload markdown content as notion pages using `@nishans/markdown`
3. [markdown-vscode](https://github.com/Devorein/Nishan/tree/master/apps/markdown-vscode) (NSY): A vscode extension to upload markdown content as notion pages using `@nishans/markdown`
4. [markdown-native](https://github.com/Devorein/Nishan/tree/master/apps/markdown-native) (NSY): A react native powered mobile app to upload markdown content as notion pages using `@nishans/markdown`
5. [notion-formula-web](https://github.com/Devorein/Nishan/tree/master/apps/notion-formula-web) (NSY): A react powered web app to view the generated notion formula ast from array, object or string representation using `@nishans/notion-formula` package

***NOTE***: The name of the package was originally named nishan, but unfortunately that name was already taken in npm. I'll use the term nishan everywhere except in case of the package names, where its nishans.

## Contributors

1. Safwan Shaheer [github](https://github.com/Devorein) Author, Maintainer
2. Matt Casey [github](https://github.com/mattcasey) Contributor

## How to contribute

1. Clone the repo locally by typing `git clone https://github.com/Devorein/Nishan.git` on the terminal.
2. Make sure you have yarn installed
3. Install all the dependencies using `yarn install`.
4. Run all the tests using `yarn test`.

Feel free to submit a pull request or open a new issue, contributions are more than welcome !!!

## Implementations in other languages

1. Python: [notion-py](https://github.com/jamalex/notion-py)
2. Go: [notionapi](https://github.com/kjk/notionapi)
3. Ruby: [notion-ruby](https://github.com/danmurphy1217/notion-ruby)
4. Kotlin: [notion-sdk-kotlin](https://github.com/notionsdk/notion-sdk-kotlin)
