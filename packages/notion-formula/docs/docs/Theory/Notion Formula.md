---
id: notion_formula
title: Understanding Notion Formula
sidebar_label: Notion Formula
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

## Types of formula parts

A notion formula consists of the following types of parts

1. [Symbol](#symbol): A formula part which is used to indicate fixed constant values like `true`, `false`, `e` and `pi`
2. [Property](#property): A formula part which is used to reference the value of another property of the schema
3. [Constant](#constant): A formula part which is used to indicate a literal constant value like a number or a text.
4. [Function](#function): A formula part which is used to create a function.
5. [Operator](#operator): A separate representation of functions, by using symbols like `+`, `-` instead of `add` and `subtract` respectively.

### Property

The computed value of a property can be used as a formula part. Inside notion it works by using the schema unit name inside the `prop` function, eg `prop("Title")`, would return the value stored in that cell.

This is how notion stores a property formula part

```js
{
  type: 'property', // has type of `property`
  id: 'title', // id of the property
  name: 'Title', // name of the property, same as the one used inside prop
  result_type: 'text', // result_type of the formula part
}
```

:::important Schema unit type coercion
Even though there are multiple schema unit types, all of them are coerced into the types supported by the `result_type`.
:::

### Function

Functions gives formulas superpowers and thus notion provides a handful of them. Visit [notion functions](./notion_functions), to learn in details about everything function.

This is how notion stores a function formula part

```js
{
  type: 'function', // has type of `function`
  result_type: 'number', // result_type of the formula part
  name: 'ceil', // name of the function
  args: [
    // A constant formula part as function argument
    {
      type: 'constant',
      result_type: 'number',
      value_type: 'number',
      value: '1'
    }
  ] // arguments array of the function
}
```

### Constant

A formula part which is used to indicate a literal constant value like a number or a text.

:::note Different from Symbol
Constants are different from symbols as symbols can only contain four possible values, while constants con contain infinity combinations of values
:::

This is how notion stores a constant formula part

```js
{
  type: 'constant', // has type of `constant`
  result_type: 'number', // the result_type of the formula part
  value_type: 'number', // the value_type indicates whether its a string or a number
  value: '1' // the actual value, 
}
```

### Operator

A separate representation of functions, by using operators like `+`, `-` instead of keywords like `add` and `subtract` respectively. Internally all operators except for the ternary operator `?:` maps to a function. Checkout the [notion operators](./notion_operators) part to learn more about them.

This is how notion stores a constant formula part

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
  ] // similar to the arguments of function part,
}
```

### Symbol

A formula part which is used to indicate fixed constant values like `true`, `false`, `e` and `pi`

It contains the following values:-

1. `true`: A checkbox rt symbol, with name `true`
2. `false`: A checkbox rt symbol with name `false`
3. `e`: A number rt symbol with name `e`
4. `pi`: A number rt symbol with name `pi`

This is how notion stores a symbol formula part

```js
{
  name: 'e', // name of the symbol
  result_type: 'checkbox'; // return type of the symbol
  type: 'symbol'; // has type of `symbol`
}
```

## Parts of a formula part

1. `type`: This is the type of the formula part, which could have the values `function | symbol | constant | property | operator`.

2. `result_type`: The computated return type of the part, which has the following values `text | checkbox | date | number`.

3. `name`: Indicates either a property, function or symbol name