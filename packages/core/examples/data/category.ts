import { TTextColor } from "@nishans/types";
import { ElementType } from "./utils";

const category = [
  "Animation",
  "Bundler",
  "CD",
  "CI",
  "Component Prototyping",
  "Dbaas",
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
  "Api Testing",
  "Reverse Proxy",
  "Runtime",
  "Server",
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
  "Serverless",
  "Version Control"
] as const;

export type TCategory = ElementType<typeof category>;

export const categories = category.map((category: TCategory) => [category, "default"]).sort((a, b) => a[0] > b[0] ? 1 : -1) as [TCategory, TTextColor][]