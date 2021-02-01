Object representation uses a very simple syntax to use all functions notion provides. Since all the operators are inherently replicable to functions, those can also be used here as well.

## Syntax

Each object representation syntax uses an object to represent the formula  function being used. There are two parts(keys) to the object representation syntax

1. `function`: This key is a string that denotes the name of the function.
2. `args`: This key contains an array of arguments.

## Arguments Combinations

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