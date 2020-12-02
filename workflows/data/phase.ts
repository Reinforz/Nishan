import {
  v4 as uuidv4
} from 'uuid';
import { SelectOption } from '../../types';

export default [{
  id: uuidv4(),
  color: "red",
  value: "Learn"
},
{
  id: uuidv4(),
  color: "yellow",
  value: "Revise"
},
{
  id: uuidv4(),
  color: "green",
  value: "Practice"
}] as SelectOption[]