import { SelectOption } from '../../types';

export default [{
  color: "red",
  value: "High"
},
{
  color: "yellow",
  value: "Medium"
},
{
  color: "green",
  value: "Low"
}] as (Omit<SelectOption, "id">)[]