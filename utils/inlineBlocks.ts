import { InlineDateArg } from "../types/function";
import { FormatBlockColor } from "../types/types";

export function inlineDate(arg: InlineDateArg) {
  const text: [[string, any[][]]] = [["‣", [["d", arg]]]];
  return {
    text,
    add(title: string) {
      text.push([title, [[""]]]);
      return new chunk(text);
    }
  }
}

export function inlineMention(id: string) {
  const mod_title: [[string, string[][]]] = [["‣", [["u", id]]]];
  return new chunk(mod_title);
}

export function inlinePage(id: string) {
  const mod_title: [[string, string[][]]] = [["‣", [["p", id]]]];
  return new chunk(mod_title);
}

export function inlineEquation(equation: string) {
  const mod_title: [[string, string[][]]] = [["⁍", [["e", equation]]]];
  return new chunk(mod_title);
}

class chunk {
  text: [[string, string[][]]];

  constructor(text: [[string, string[][]]]) {
    this.text = text;
  }

  get strikeThrough() {
    this.text[this.text.length - 1][1].push(["s"]);
    return new chunk(this.text);
  }

  get code() {
    this.text[this.text.length - 1][1].push(["c"]);
    return new chunk(this.text);
  }

  get bold() {
    this.text[this.text.length - 1][1].push(["b"]);
    return new chunk(this.text);
  }

  get italic() {
    this.text[this.text.length - 1][1].push(["i"]);
    return new chunk(this.text);
  }

  get underline() {
    this.text[this.text.length - 1][1].push(["_"]);
    return new chunk(this.text);
  }

  add(title: string) {
    this.text.push([title, [[""]]]);
    return new chunk(this.text);
  }

  highlight(color: FormatBlockColor) {
    this.text[this.text.length - 1][1].push(["h", color]);
    return new chunk(this.text);
  }

  equation(equation: string) {
    this.text.push(["⁍", [["e", equation]]]);
    return new chunk(this.text);
  }
}

export function inlineText(title: string) {
  const mod_title: [[string, string[][]]] = [[title, [[""]]]];
  return new chunk(mod_title);
}