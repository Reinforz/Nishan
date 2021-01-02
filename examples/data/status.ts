import { SelectOption } from '../../packages/core/dist/Nishan';

export default [{
  color: "red",
  value: "To Complete"
},
{
  color: "yellow",
  value: "Completing"
},
{
  color: "green",
  value: "Completed"
}] as (Omit<SelectOption, "id">)[]