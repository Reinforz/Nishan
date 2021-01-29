---
id: notion_formula
title: Understanding Notion Formula
sidebar_label: Notion Formula
slug: /theory/
---

Notion provides formula to dynamically calculate the value of a specific cell for a database.

If you navigate to your devtools and inspect the data, you'll see that this is how notion stores formula data. Lets take a look at an example of a simple notion formula:-

```js {2-5}
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

1. `type`: This is the type of the formula part, which could have the following values
    1. `function`: This type indicates that this part is a [function](./notion_functions).
    2. `constant`: This type indicates that this part is a [constant](#constant).
    3. `symbol`: This type indicates that this part is a [symbol](#symbol).
    4. `property`: This type indicates that this part is a [property](#property).
    5. `operator`: This type indicates that this part is a [operator](#operator).

2. `result_type`: The computated result_type of the part, which dictates the final computed value of the formula and has the following values:-
    1. `text`: This formula part returns a text resultant value, which is equal to a string
    2. `checkbox`: This formula part returns a checkbox resultant value, which is equal to a boolean
    3. `date`: This formula part returns a date resultant value
    4. `number`: This formula part returns a number resultant value