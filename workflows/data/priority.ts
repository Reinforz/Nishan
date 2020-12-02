import {
  v4 as uuidv4
} from 'uuid';
import { SelectOption } from '../../types';

export default [{
  id: uuidv4(),
  color: "red",
  value: "High"
},
{
  id: uuidv4(),
  color: "yellow",
  value: "Medium"
},
{
  id: uuidv4(),
  color: "green",
  value: "Low"
}] as SelectOption[]