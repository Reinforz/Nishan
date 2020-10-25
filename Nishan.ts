import { v4 as uuidv4 } from 'uuid';

import { NishanArg, Predicate } from "./types/types";
import { error } from "./utils/logs";
import Space from "./api/Space";
import Getters from "./api/Getters";
import { blockUpdate, spaceListAfter, spaceViewSet, userSettingsUpdate, userRootListAfter } from './utils/chunk';
import { ISpace } from './types/api';

class Nishan extends Getters {
  constructor(arg: NishanArg<any>) {
    super(arg);
  }

  async init(arg: string | Predicate<ISpace>) {
    await this.getAllSpaces();
    const space = await this.getSpace(arg);
    if (space.data) {
      this.shard_id = space.data.shard_id;
      this.space_id = space.data.id;
      this.user_id = space.data.permissions[0].user_id;
    }
    return space;
  }

  async getSpace(arg: Predicate<ISpace> | string) {
    const res = await this.getAllSpaces();
    let target_space: ISpace | undefined = arg === undefined ? Object.values(Object.values(res)[0].space)[0].value : undefined;
    if (arg !== undefined)
      Object.values(res).forEach(user => {
        target_space = (Object.values(user.space).find((space, index) => typeof arg === "string" ? space.value.id === arg : arg(space.value, index))?.value)
      });

    if (target_space)
      return new Space({
        type: "space",
        ...this.getProps(),
        shard_id: (target_space as ISpace).shard_id,
        space_id: (target_space as ISpace).id,
        user_id: (target_space as ISpace).permissions[0].user_id,
        data: target_space
      })
    else throw new Error(error(`No space matches the criteria`));
  }

  async getSpaces(arg: undefined | Predicate<ISpace> | string[]) {
    const res = Object.values(await this.getAllSpaces());
    let target_spaces: Space[] = [];

    for (let i = 0; i < res.length; i++) {
      const spaces = Object.values(res[i].space);
      for (let j = 0; j < spaces.length; j++) {
        const space = spaces[j];
        let should_add = false;
        if (arg === undefined)
          should_add = true;
        else if (Array.isArray(arg) && arg.includes(space.value.id))
          should_add = true;
        else if (typeof arg === "function")
          should_add = await arg(space.value, i);

        if (should_add) {
          target_spaces.push(new Space({
            type: "space",
            data: space.value,
            ...this.getProps()
          }))
        }
      }
    }
    return target_spaces;
  }

  async createWorkSpace(opt: Partial<Pick<ISpace, "name" | "icon">>) {
    const { name = "Workspace", icon = "" } = opt;

    const $block_id = uuidv4();
    const $space_view_id = uuidv4();

    const { spaceId: $space_id } = await this.createSpace({ name, icon });

    await this.saveTransactions([
      userSettingsUpdate(this.user_id, ['settings'], {
        persona: 'personal', type: 'personal'
      }),
      spaceViewSet($space_view_id, [], {
        created_getting_started: false,
        created_onboarding_templates: false,
        space_id: $space_id,
        notify_mobile: true,
        notify_desktop: true,
        notify_email: true,
        parent_id: this.user_id,
        parent_table: 'user_root',
        alive: true,
        joined: true,
        id: $space_view_id,
        version: 1,
        visited_templates: ["7e89f436-7aac-4f66-b0a6-6e65ec868d2a"],
        sidebar_hidden_templates: ["7e89f436-7aac-4f66-b0a6-6e65ec868d2a"],
      }),
      blockUpdate($block_id, [], {
        type: 'page',
        id: $block_id,
        version: 1,
        parent_id: $space_id,
        parent_table: 'space',
        alive: true,
        permissions: [{ type: 'user_permission', role: 'editor', user_id: this.user_id }],
        created_by_id: this.user_id,
        created_by_table: 'notion_user',
        created_time: Date.now(),
        last_edited_time: Date.now(),
        last_edited_by_table: 'notion_user',
        last_edited_by_id: this.user_id,
        properties: {
          title: [[name]]
        }
      }),
      userRootListAfter(this.user_id, ['space_views'], { id: $space_view_id }),
      spaceListAfter($space_id, ['pages'], { id: $block_id }),
    ]);
    await this.loadUserContent();
    const space = this.cache.space.get($space_id);
    if (space) {
      return new Space({
        type: "space",
        data: space,
        ...this.getProps()
      })
    };
  };
}

export default Nishan;
export * from "./utils/inlineBlocks";