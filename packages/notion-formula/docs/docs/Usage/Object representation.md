Object representation uses a very simple syntax to use all functions notion provides. Since all the operators are inherently replicable to functions, those can also be used here as well.

## Syntax

Each object representation syntax uses an object to represent the formula function being used. There are two parts(keys) to the object representation syntax

1. `function`: This key is a string that denotes the name of the function.
2. `args`: This key contains an array of arguments.

## Arguments `result_type` x `type` Combinations syntax

The following syntax's are used as arguments for specific combinations.

* **number x symbol**: `'e' | 'pi'`
* **number x constant**: `1 | 2`
* **number x property**: `{property: "Number"}`
* **number x function**: `{function: "abs", args: [1]}`

* **text x constant**: `'1' | 'a'`
* **text x property**: `{property: "Text"}`
* **text x function**: `{function: "concat", args: ["a", "b"]}`

* **checkbox x symbol**: `true | false`
* **checkbox x property**: `{property: "Checkbox"}`
* **checkbox x function**: `{function: "and", args: [false, true]}`

* **date x property**: `{property: "Date"}`
* **date x function**: `{function: "now"}`


:::note No Operators
Since all the operators are internally mapped to a function, there is no special syntax for operators
:::

## Examples

```ts
import {generateFormulaASTFromObject} from "@nishans/notion-formula";

generateFormulaASTFromObject(
  {
    function: "abs", // name of the function being used
    args: [1] // an array of arguments, here only a single number constant
  }
)

generateFormulaASTFromObject(
  {
    function: "add", // name of the function being used
    args: [
      {
        function: "abs",
        args: [1]
      } // A nested function formula being used as an argument
      1,
    ] // an array of arguments, here only a single number constant
  }
)
```

Take a look at [examples](../Examples/) to see more examples of every argument combinations.