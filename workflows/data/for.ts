import { TTextColor } from "../../types";

export type TFor =
  "Javascript" |
  "Python" |
  "Node" |
  "CSS" |
  "HTML" |
  "SQL" |
  "React" |
  "Typescript" |
  "GraphQL" |
  "Markdown" |
  "MongoDB";

export const fors: [TFor, TTextColor][] = [
  ["Javascript", "yellow"],
  ["Python", "blue"],
  ["Node", "green"],
  ["CSS", "blue"],
  ["HTML", "orange"],
  ["SQL", "purple"],
  ["React", "blue"],
  ["Typescript", "blue"],
  ["GraphQL", "pink"],
  ["Markdown", "default"],
  ["MongoDB", "green"],
].sort((a, b) => a[0] > b[0] ? 1 : -1) as [TFor, TTextColor][] 
