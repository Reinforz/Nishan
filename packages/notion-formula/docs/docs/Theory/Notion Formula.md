---
slug: /theory/
---

Notion provides formula to dynamically calculate the value of a specific cell for a database.

If you navigate to your devtools and inspect the data, you'll see that this is how notion stores formula data. Lets take a look at an example of a simple notion formula:-

```js
const formula = {
  "type": "function",
  "result_type": "number",
  "name": "abs",
  "args": [
    {
      "type": "constant",
      "result_type": "number",
      "value": "1",
      "value_type": "number"
    }
  ]
}
```

## Parts of a formula argument

1. `type`: This is the `type` of the formula argument, which could have the values `function | symbol | constant | property | operator`.

2. `result_type`: The computated type of the argument, which has the following values `text | checkbox | date | number`.

3. `name`: Indicates either a property, operator,function or symbol name, this is absent in constant `type`

## Formula Argument Result type

Based on an arguments `result_type` it can be divided into the following types:

1. `checkbox`: This sort of arguments return a boolean value.
2. `text`: This sort of arguments return a string value.
3. `date`: This sort of arguments return a date value
4. `number`: This sort of arguments return a number value, which could either be integer or float.

## Formula argument variants

Based on an arguments `type` it can be divided into the following types:

1. [Symbol](#symbol): A formula argument which is used to indicate fixed constant values like `true`, `false`, `e` and `pi`
2. [Property](#property): A formula argument which is used to reference the value of another property of the schema
3. [Constant](#constant): A formula argument which is used to indicate a literal constant value like a number or a text.
4. [Function](#function): A formula argument which is used to create a function.
5. [Operator](#operator): A separate representation of functions, by using symbols like `+`, `-` instead of `add` and `subtract` respectively.

:::note All variants have `result_type`
Each of the variants return an argument of a specific `result_type`.
:::

### Property Reference Argument

The computed value of a property can be used as a formula argument. Inside notion it works by using the schema unit name inside the `prop` function, eg `prop("Title")`, would return the value stored in that cell.

This is how notion stores a property formula argument

```js
{
  type: 'property', // has type of `property`
  id: 'title', // id of the property
  name: 'Title', // name of the property, same as the one used inside prop
  result_type: 'text', // result_type of the formula argument
}
```

:::important Schema unit type coercion
Even though there are multiple schema unit types, all of them are coerced into the types supported by the `result_type`.
:::

### Nested Function Argument

Functions gives formulas superpowers and thus notion provides a handful of them. Visit [notion functions](./notion_functions), to learn in details about everything function.

This is how notion stores a function formula argument

```js
{
  type: 'function', // has type of `function`
  result_type: 'number', // result_type of the formula argument
  name: 'ceil', // name of the function
  args: [
    // A constant formula argument as function argument
    {
      type: 'constant',
      result_type: 'number',
      value_type: 'number',
      value: '1'
    }
  ] // arguments array of the function
}
```

### Constant Literal Argument

A formula argument which is used to indicate a literal constant value like a number or a text.

:::note Different from Symbol
Constants are different from symbols as symbols can only contain four possible values, while constants con contain infinity variants of values
:::

This is how notion stores a constant formula argument

```js
{
  type: 'constant', // has type of `constant`
  result_type: 'number', // the result_type of the formula argument
  value_type: 'number', // the value_type indicates whether its a string or a number
  value: '1' // the actual value, 
}
```

### Operator Function Argument

A separate representation of functions, by using operators like `+`, `-` instead of keywords like `add` and `subtract` respectively. Internally all operators except for the ternary operator `?:` maps to a function. Checkout the [notion operators](./notion_operators) argument to learn more about them.

This is how notion stores a constant formula argument

```js
{
  type: 'operator', // has type of `operator`
  result_type: 'number', // the result_type of the operator
  operator: '+', // the operator used
  name: 'add', // the name of the function mapped to the operator
  args: [
    {
      type: 'constant',
      result_type: 'number',
      value_type: 'number',
      value: '1'
    },
    {
      type: 'constant',
      result_type: 'number',
      value_type: 'number',
      value: '2'
    }
  ] // similar to the arguments of function argument,
}
```

### Symbol Literal Argument

A formula argument which is used to indicate fixed constant values like `true`, `false`, `e` and `pi`

It contains the following values:-

1. `true`: A checkbox rt symbol, with name `true`
2. `false`: A checkbox rt symbol with name `false`
3. `e`: A number rt symbol with name `e`
4. `pi`: A number rt symbol with name `pi`

This is how notion stores a symbol formula argument

```js
{
  name: 'e', // name of the symbol
  result_type: 'checkbox'; // return type of the symbol
  type: 'symbol'; // has type of `symbol`
}
```

## Variants of formula arguments

Due to the existence of `result_type` and `type`, the following variants of arguments arises

### Number x `type` variants

1. **number x symbol**: A `symbol` `type` argument that returns `number` as `result_type`. Eg: `e | pi`
2. **number x constant**: A `symbol` `type` argument that returns `number` as `result_type`. Eg: `1 | 10`
3. **number x property**: A `property` `type` argument that returns `number` as `result_type`. Eg: `prop("Number")`
4. **number x function**: A `property` `type` argument that returns `number` as `result_type`. Eg: `abs(1)`
5. **number x operator**: A `property` `type` argument that returns `number` as `result_type`. Eg: `1 + 1`

### Text x `type` variants

1. **text x constant**: A `constant` `type` argument that returns `text` as `result_type`. Eg: `"1" | "a"`
2. **text x property**: A `property` `type` argument that returns `text` as `result_type`. Eg: `prop("Text")`
3. **text x function**: A `property` `type` argument that returns `text` as `result_type`. Eg: `concat("a", "b")`
4. **text x operator**: A `property` `type` argument that returns `text` as `result_type`. Eg: `"b" + "a"`

:::important No symbol for `text`
Text `result_type` arguments does not have a `symbol` `type`
:::

### Checkbox x `type` variants

1. **checkbox x symbol**: A `symbol` `type` argument that returns `checkbox` as `result_type`. Eg: `true  | false`
2. **checkbox x property**: A `property` `type` argument that returns `checkbox` as `result_type`. Eg: `prop("Checkbox")`
3. **checkbox x function**: A `property` `type` argument that returns `checkbox` as `result_type`. Eg: `and(true, false)`
4. **checkbox x operator**: A `property` `type` argument that returns `checkbox` as `result_type`. Eg: `true and false`

:::important No constant for `text`
Checkbox `result_type` arguments does not have a `constant` `type`
:::

### Date x `type` variants

1. **date x property**: A `property` `type` argument that returns `date` as `result_type`. Eg: `prop("Date")`
2. **date x function**: A `property` `type` argument that returns `date` as `result_type`. Eg: `now()`

:::important No constant,symbol for `date`
Date `result_type` arguments does not have `constant` and `symbol` variants
:::