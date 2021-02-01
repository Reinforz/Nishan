---
id: notion_functions
title: Understanding Notion Functions
sidebar_label: Notion Functions
slug: /theory/notion_functions
---

Notion provides a vast array of functions capable of some extremely powerful stuffs.

The table below provides description of all the functions notion provides.

## if

Checks if the first argument is true or false and based on that chooses either the 2nd ( if `true` ) or 3rd ( if `false` ) argument.

### Signatures

| Arity       | Result Type |
| ----------- | ----------- |
| `(checkbox, text, text)` | `text`     |
| `(checkbox, boolean, boolean)` | `boolean`     |
| `(checkbox, number, number)` | `number`     |
| `(checkbox, checkbox, checkbox)` | `checkbox`     |