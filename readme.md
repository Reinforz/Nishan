<img height="125px" width="125px" src = "https://raw.githubusercontent.com/Devorein/Nishan/c6b6a44002d83f53cc5ca0d671554be25fe11a14/public/Logo.svg">

<img src="https://github.com/devorein/nishan/workflows/Lint,%20Build%20and%20Test/badge.svg"/>

# Nishan

Unofficial Notion api for node.js with all crud functionalities for Space, User, Block, Page and many more.

This monorepo contains/will contain the following packages:-

1. @nishan/core: Core package for nishan with crud api
2. @nishan/types: Typescript typings for Notion only
3. @nishan/utils: Utility package to make working with notion easier
4. @nishan/store (WIP): A package to easily backup or download data locally or in a remote dbaas
5. @nishan/graphql (WIP): A graphql server and client UI to make working with nishan a breeze
6. @nishan/cli (WIP): A package to interact with the nishan api from the terminal
7. @nishan/codegen (WIP): A package to automatically generate typescript definitions from a notion collection schema
8. @nishan/orm (WIP): A package to use notion as a database by providing an easy to use orm api

Please visit [Nishan doc](https://nishan-docs.netlify.app/) to learn more.

Check out the [examples](https://github.com/Devorein/Nishan/tree/master/examples) folder for some examples that I personally use

## Contributors

1. Safwan Shaheer [github](https://github.com/Devorein) Author, Maintainer
2. Matt Casey [github](https://github.com/mattcasey) Contributor

## NOTE

1. Right now this repo is yet to be published as a package on npm, but that is definitely on the roadmap.
2. The documentation still needs a lot of work, so please stay patient as I am trying my best.

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
