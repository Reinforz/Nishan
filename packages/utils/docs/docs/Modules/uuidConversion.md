This module exports two simple functions to transform between regular id and notion compatible id.

## idToUuid

As the name suggests this function converts id to uuid

```js
const {idToUuid} = require("@nishans/utils");

console.log(idToUuid("dd721d8bbf354036bdcde9378e8b7e83"));
// dd721d8b-bf35-4036-bdcd-e9378e8b7e83
```

## uuidToId

Converts a regular id to a notion compatible uuid

```js
const {idToUuid} = require("@nishans/utils");

console.log(idToUuid("dd721d8b-bf35-4036-bdcd-e9378e8b7e83"));
// dd721d8bbf354036bdcde9378e8b7e83
```