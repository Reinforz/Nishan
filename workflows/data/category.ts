import { TTextColor } from "../../types";

export type TCategory =
  "Runtime" |
  "Database" |
  "Server" |
  "Superset" |
  "Pre-processor" |
  "ORM" |
  "Framework" |
  "Package Manager" |
  "Language" |
  "Tools" |
  "Library" |
  "Technology" |
  "Bundler" |
  "Template Engine" |
  "Editor" |
  "Stack" |
  "Doc Generator";

export const categories: [TCategory, TTextColor][] = [
  ["Runtime", "default"],
  ["Database", "default"],
  ["Server", "default"],
  ["Superset", "default"],
  ["Pre-processor", "default"],
  ["ORM", "default"],
  ["Framework", "default"],
  ["Package Manager", "default"],
  ["Language", "default"],
  ["Tools", "default"],
  ["Library", "default"],
  ["Technology", "default"],
  ["Bundler", "default"],
  ["Template Engine", "default"],
  ["Editor", "default"],
  ["Stack", "default"],
  ["Doc Generator", "default"],
]
