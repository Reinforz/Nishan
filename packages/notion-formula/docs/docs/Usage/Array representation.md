Array based representation is simpler that [Object Based](./Object%20Representation) since it uses an array to indicate the function that is being used and its arguments.

## Syntax

There are two parts(keys) to the array representation syntax and its based on its index, not property unlike object 

1. `0`: This index is a string that denotes the name of the function.
2. `1`: This index contains an array of arguments.

## Arguments `result_type` x `type` Combinations syntax

The following syntax's are used as arguments for specific combinations.

* **number x symbol**: `'e' | 'pi'`
* **number x constant**: `1 | 2`
* **number x property**: `{property: "Number"}`
* **number x function**: `["abs", [1]]`

* **text x constant**: `'1' | 'a'`
* **text x property**: `{property: "Text"}`
* **text x function**: `["concat",["a", "b"]]`

* **checkbox x symbol**: `true | false`
* **checkbox x property**: `{property: "Checkbox"}`
* **checkbox x function**: `["and", [false, true]]`

* **date x property**: `{property: "Date"}`
* **date x function**: `["now"]`

## Examples

```ts
import {generateFormulaASTFromArray} from "@nishans/notion-formula";

generateFormulaASTFromArray(
  [
    "abs", // name of the function being used
    [1] // an array of arguments, here only a single number constant
  ]
)

generateFormulaASTFromArray(
  [
    "add", // name of the function being used
    [
      [
        "abs", // name of the nested function
        [1] // arguments array of the nested function
      ], // A nested function formula being used as an argument
      1
    ]
  ];
)
```