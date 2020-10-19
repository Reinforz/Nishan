
import { ISpace, NishanArg } from "./types";
import { error } from "./utils/logs";
import Space from "./api/Space";
import Getters from "./api/Getters";

class Nishan extends Getters {
  constructor(arg: NishanArg) {
    super(arg);
  }

  async init(arg: string | ((space: ISpace) => boolean)) {
    await this.loadUserContent();
    const space = await this.getSpace(arg);
    return space;
  }

  // ? FEAT: getSpace method using function or id
  async getSpace(arg: ((space: ISpace) => boolean) | string) {
    const { space } = await this.loadUserContent();

    const target_space = (Object.values(space).find((space) => typeof arg === "string" ? space.value.id === arg : arg(space.value))?.value || Object.values(space)[0].value);
    if (!target_space) throw new Error(error(`No space matches the criteria`));

    return new Space({
      ...this.getProps(),
      shard_id: target_space.shard_id,
      space_id: target_space.id,
      user_id: target_space.permissions[0].user_id,
      space_data: target_space
    })
  }
}

export default Nishan;
