import { InlineDateArg } from "../types/function";
import { FormatBlockColor } from "../types/types";

export function inlineDate(arg: InlineDateArg) {
  const text: [[string, any[][]]] = [["‣", [["d", arg]]]];
  return {
    text,
    add(title: string) {
      text.push([title, [[""]]]);
      return chunk(text);
    }
  }
}

export function inlineMention(id: string) {
  const mod_title: [[string, string[][]]] = [["‣", [["u", id]]]];
  return chunk(mod_title);
}

export function inlinePage(id: string) {
  const mod_title: [[string, string[][]]] = [["‣", [["p", id]]]];
  return chunk(mod_title);
}

export function inlineEquation(equation: string) {
  const mod_title: [[string, string[][]]] = [["⁍", [["e", equation]]]];
  return chunk(mod_title);
}

function chunk(text: [[string, string[][]]]) {
  return {
    text,
    strikeThrough() {
      text[text.length - 1][1].push(["s"]);
      return chunk(text);
    },
    code() {
      text[text.length - 1][1].push(["c"]);
      return chunk(text);
    },
    bold() {
      text[text.length - 1][1].push(["b"]);
      return chunk(text);
    },
    italic() {
      text[text.length - 1][1].push(["i"]);
      return chunk(text);
    },
    underline() {
      text[text.length - 1][1].push(["_"]);
      return chunk(text);
    },
    add(title: string) {
      text.push([title, [[""]]]);
      return chunk(text);
    },
    highlight(color: FormatBlockColor) {
      text[text.length - 1][1].push(["h", color]);
      return chunk(text);
    },
    equation(equation: string) {
      text.push(["⁍", [["e", equation]]]);
      return chunk(text);
    }
  }
}

export function inlineText(title: string) {
  const mod_title: [[string, string[][]]] = [[title, [[""]]]];
  return chunk(mod_title);
}