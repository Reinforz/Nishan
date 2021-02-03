Inline block module as the name suggests is responsible for creating, decorating and formatting inline blocks. These inline blocks can be embedded inside of a text, thus they are known as inline blocks. These generated blocks can then be used in the `title` properties of various blocks.

There are various kinds of inline blocks that Notion supports:

1. Date
2. Mention
3. Page
4. Equation
5. Text
6. Links

All the above inline blocks can be highlighted with a few selection of colors and background colors.

## Inline Texts

### Adding texts

```js
const { inlineText } = require("@nishans/utils");
console.log(inlineText("text").add(" extra").text);

// [["text"],[" extra"]]
```

![Text Extra Image](../../static/img/inlineblocks/text_extra.png)

### Adding Links

```js
const { inlineText } = require("@nishans/utils");
console.log(inlineText("google").linkTo("https://google.com").text);

// [["google",[["a","https://google.com"]]]]
```

### Adding Formats

```js
const { inlineText } = require("@nishans/utils");
console.log(inlineText("text bold").bold.add(" extra italic").italic.text);

// [["text bold", [["b"]]],[" extra italic", [["i"]]]]
```

![Text Bold Extra Italic Image](../../static/img/inlineblocks/text_bold_extra_italic.png)

### Adding highlight colors

```js
const { inlineText } = require("@nishans/utils");
console.log(inlineText("text red background").redbg.add(" extra blue bold").blue.bold.text);

// [["text red background",[["h","red_background"]]],[" extra blue bold",[["h","blue"],["b"]]]]
```

![Text Red Extra Blue Bold Image](../../static/img/inlineblocks/text_red_bg_extra_blue_bold.png)

:::note How `add` works
All the format methods called after `add` will work on that chuck of inline block. For example

```js
const { inlineText } = require("@nishans/utils");
console.log(inlineText("text").add("extra").blue.bold.text);

// [["text"],["extra",[["h","blue"],["b"]]]]
// Note that ["text"] is empty since the blue bold formats has been applied to the last add block "extra"
```

:::

:::caution Call `text`
Remember to call the `text` property at last to get the actual format value suitable to be used as a title.
:::

Check out the API section to learn more about the supported highlight, formats and methods.

## Inline date

A fully featured date/time system can also be integrated as an inline block.

```js
const { inlineDate } = require("@nishans/utils");
console.log(inlineDate(
  {
    "type":"date",
    "start_date":"2021-02-03",
    "date_format":"relative"
  }
).text);

// [["‣",[["d",{"type":"date","start_date":"2021-02-03","date_format":"relative"}]]]]
```

## Inline Mention

Another workspace user can be mentioned using inline mention

```js
const { inlineMention } = require("@nishans/utils");
console.log(inlineMention("12f85506-b758-481a-92b1-73984a90300a").text);

// [["‣",[["u","12f85506-b758-481a-92b1-73984a90300a"]]]]
```

## Inline Page

Another workspace page can be referenced using inline page, which creates a link to that page.

```js
const { inlinePage } = require("@nishans/utils");
console.log(inlinePage("12f85506-b758-481a-92b1-73984a90300a").text);

// [["‣",[["p","12f85506-b758-481a-92b1-73984a90300a"]]]]
```

## Inline Equation

Notion supports inline equations as well.

```js
const { inlineEquation } = require("@nishans/utils");
console.log(inlineEquation("x ^ 2").text);

// [["⁍",[["e","x ^ 2"]]]]
```