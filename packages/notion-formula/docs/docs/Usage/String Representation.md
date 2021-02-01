String representation is what notion actually provides and its the simplest way to represent a formula.

## Syntax

Similar to the other two representations, string representation also contains two parts :-
There are two parts(keys) to the array representation syntax and its based on its index, not property unlike object 

1. `function_name`: This is a string that denotes the name of the function.
2. `args`: A `()` surrounded and `,` separated list of arguments.

## Arguments `result_type` x `type` Combinations syntax

The following syntax's are used as arguments for specific combinations.

* **number x symbol**: `'e' | 'pi'`
* **number x constant**: `1 | 2`
* **number x property**: `prop("Number")`
* **number x function**: `abs(1)`

* **text x constant**: `'1' | 'a'`
* **text x property**: `prop("Text")`
* **text x function**: `concat("a", "b")`

* **checkbox x symbol**: `true | false`
* **checkbox x property**: `prop("Checkbox")`
* **checkbox x function**: `and(false, true)`

* **date x property**: `prop("Date")`
* **date x function**: `now()`

## Examples

```ts
import {generateFormulaASTFromString} from "@nishans/notion-formula";

generateFormulaASTFromString("abs(1)")
generateFormulaASTFromString("add(abs(1), 2)")
```