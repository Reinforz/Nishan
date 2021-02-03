

## Requirements

1. You must have atleast node v12 installed
2. If you have node installed npm will also be installed, you can either use npm or download yarn and use it.

## Installing

1. Open up your terminal and navigate to the directory you wanna install the package at.
2. Type `yarn add @nishans/utils` or `npm install @nishans/utils` in the terminal.

## Usage

```js
const { generateSchemaMap } = require('@nishans/utils');

const token = 'token_v2';

async function main () {
  console.log(await generateSchemaMap(token, 'collection_block_id'));
}

main();

/*
Map {
  'Number' => { schema_id: 'LXec', name: 'Number', type: 'number' },
  'Title' => { schema_id: 'title', name: 'Title', type: 'title' },
  'Text' => { schema_id: 'text', name: 'Text', type: 'text' },
}
*/
```