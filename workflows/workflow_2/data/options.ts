import {
  v4 as uuidv4
} from 'uuid';
import { SelectOption, TTextColor } from '../../../types';

export type language = "Javascript" | "Python" | "C#" | "Dart" | "Java" | "Node" | 'PHP' | "C++" | "CSS" | "HTML" | "SQL" | "Ruby" | "Go";
export type category = "Database" | "Framework" | "Language" | "Tools" | "Library" | "Technology";

const language_options: [language, TTextColor][] = [["Javascript", "yellow"], ["Python", "blue"], ["C#", "purple"], ["Dart", "blue"], ["Node", "green"], ["PHP", "purple"], ["CSS", "blue"], ["Java", "orange"], ["C++", "blue"], ["HTML", "orange"], ["SQL", "purple"], ["Ruby", "red"], ["Go", "blue"]];
const category_options: [category, TTextColor][] = [["Database", "green"], ["Framework", "orange"], ["Language", "purple"], ["Library", "brown"], ["Tools", "default"], ["Technology", "pink"]];

export default {
  language: language_options.map(([value, color]) => ({ id: uuidv4(), value, color })) as SelectOption[],
  category: category_options.map(([value, color]) => ({ id: uuidv4(), value, color })) as SelectOption[],
} 