import {
  v4 as uuidv4
} from 'uuid';
import { SelectOption } from '../../types';

export default [{
  id: uuidv4(),
  color: "red",
  value: "To Complete"
},
{
  id: uuidv4(),
  color: "yellow",
  value: "Completing"
},
{
  id: uuidv4(),
  color: "green",
  value: "Completed"
}] as SelectOption[]