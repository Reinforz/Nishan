Generate a `schema_map` that can be used in packages like [notion-formula](https://nishans-notion-formula.netlify.app). This function extract a remote notion collection schema and returns a map of it. Click [here](https://nishans-notion-formula.netlify.app/docs/Theory/Schema%20Map) to learn more about `schema_map`.

## generateSchemaMap

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