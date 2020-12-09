
import { SelectOption } from '../../types';

export default [{
  color: "red",
  value: "Hard"
},
{
  color: "yellow",
  value: "Medium"
},
{
  color: "green",
  value: "Easy"
}] as (Omit<SelectOption, "id">)[]