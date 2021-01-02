import { SelectOption } from '../../packages/core/dist/Nishan';

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