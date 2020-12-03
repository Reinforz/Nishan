import { TTextColor } from "../../types";

export type TCategory =
  "Design System" |
  "HTTP" |
  "Animation" |
  "Transpiler" |
  "Linter" |
  "SSG" |
  "SSR" |
  "Microservices" |
  "State Management" |
  "Shell Scripting" |
  "Testing" |
  "Runtime" |
  "Database" |
  "Server" |
  "PAAS" |
  "Superset" |
  "API Testing" |
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
  "Doc Generator" |
  "Version Control" |
  "CD" |
  "Markup" |
  "Orchestration" |
  "Cloud Platform" |
  "Load Balancer" |
  "Reverse Proxy" |
  "CI";

export const categories: [TCategory, TTextColor][] = [
  "Animation",
  "Bundler",
  "CD",
  "CI",
  "Cloud Platform",
  "Database",
  "Design System",
  "Doc Generator",
  "Editor",
  "Framework",
  "HTTP",
  "Language",
  "Library",
  "Linter",
  "Load Balancer",
  "Markup",
  "Microservices",
  "Orchestration",
  "ORM",
  "Package Manager",
  "PAAS",
  "Pre-processor",
  "API Testing",
  "Reverse Proxy",
  "Runtime",
  "Shell Scripting",
  "SSG",
  "SSR",
  "Stack",
  "State Management",
  "Superset",
  "Technology",
  "Template Engine",
  "Testing",
  "Tools",
  "Transpiler",
  "Version Control"
].map((category) => [category, "default"] as [TCategory, TTextColor]) 
