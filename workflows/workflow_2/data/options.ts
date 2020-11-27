import {
  v4 as uuidv4
} from 'uuid';
import { SelectOption, TTextColor } from '../../../types';

const language_options: [string, TTextColor][] = [["Javascript", "yellow"], ["Python", "blue"], ["C#", "purple"], ["Dart", "blue"], ["Node", "green"], ["PHP", "purple"], ["CSS", "blue"]];
const category_options: [string, TTextColor][] = [["Database", "green"], ["Framework", "orange"], ["Language", "purple"], ["Library", "brown"], ["Tools", "default"], ["Technology", "pink"]];

export default {
  language: language_options.map(([value, color]) => ({ id: uuidv4(), value, color })) as SelectOption[],
  category: category_options.map(([value, color]) => ({ id: uuidv4(), value, color })) as SelectOption[],
} 