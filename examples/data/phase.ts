
import { SelectOption } from '../../types';

export default [{
  color: "red",
  value: "Learn"
},
{
  color: "yellow",
  value: "Revise"
},
{
  color: "green",
  value: "Practice"
}] as (Omit<SelectOption, "id">)[]