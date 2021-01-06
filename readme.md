<p align="center"><a href="https://nishan-docs.netlify.app/" target="_blank" rel="noopener noreferrer"><img width="125" src="https://raw.githubusercontent.com/Devorein/Nishan/655689d3d66210126c0a19be473074d790d33e0a/public/Logo.svg" alt="Vue logo"></a></p>

<p align="center">
  <a href="https://github.com/Devorein/Nishan/actions?query=workflow%3A%22Lint%2C+Build+and+Test%22"><img src="https://github.com/devorein/nishan/workflows/Lint,%20Build%20and%20Test/badge.svg"/></a>
  <a href="https://codecov.io/github/devorein/nishan?branch=master"><img src="https://img.shields.io/codecov/c/github/devorein/nishan/master.svg?sanitize=true" alt="Coverage Status"></a>
  <img src="https://img.shields.io/github/repo-size/devorein/nishan?style=flat-square"/>
  <img src="https://img.shields.io/github/commit-activity/m/devorein/nishan" />
  <img src="https://img.shields.io/github/contributors/devorein/nishan?label=contributors">
</p>

# Nishan

Unofficial Notion api for node.js with all crud functionalities for Space, User, Block, Page and many more.

This monorepo contains/will contain the following packages:-

1. @nishans/core (Published): Core package for nishan with crud api
2. @nishans/types (Published): Typescript typings for Notion only
3. @nishans/utils (Published): Utility package to make working with notion easier
4. @nishans/store (WIP): A package to easily backup or download notion data locally or in a remote dbaas
5. @nishans/graphql (WIP): A graphql server and client UI to make working with nishan a breeze
6. @nishans/cli (WIP): A package to interact with the nishan api from the terminal
7. @nishans/typegen (WIP): A package to automatically generate typescript definitions from a remote notion collection schema
8. @nishans/orm (WIP): A package to use notion as a database by providing an easy to use orm api

***NOTE:***: The name of the package was originally named nishan, but unfortunately that name was already taken in npm. I'll use the term nishan everywhere except in case of the package names, where its `nishans`.

Please visit [Nishan doc](https://nishan-docs.netlify.app/) to learn more.

Check out the [examples](https://github.com/Devorein/Nishan/tree/master/examples) folder for some examples that I personally use

## Contributors

1. Safwan Shaheer [github](https://github.com/Devorein) Author, Maintainer
2. Matt Casey [github](https://github.com/mattcasey) Contributor

## NOTE

1. Right now only the core and types packages have been released, the rest will soon follow.
2. The documentation still needs a lot of work, please stay patient as I am trying my best.

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
