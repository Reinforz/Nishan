import {
  v4 as uuidv4
} from 'uuid';
import { SelectOption, TTextColor } from '../../../types';

const options: [string, TTextColor][] = [["Javascript", "yellow"], ["Python", "blue"], ["C#", "purple"], ["Dart", "blue"], ["Node", "teal"], ["PHP", "purple"], ["CSS", "blue"]];

export const LanguageOptions = options.map(([value, color]) => ({ id: uuidv4(), value, color })) as SelectOption[]