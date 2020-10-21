import { v4 as uuidv4 } from 'uuid';

import { NishanArg } from "./types/types";
import { error } from "./utils/logs";
import Space from "./api/Space";
import Getters from "./api/Getters";
import { blockUpdate, spaceListAfter, spaceViewSet, userSettingsUpdate, userRootListAfter } from './utils/chunk';
import { ISpace } from './types/api';

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

  // ? FIX:1:H Not working
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
        visited_templates: [],
        sidebar_hidden_templates: [],
      }),
      blockUpdate($block_id, [], {
        type: 'copy_indicator', id: $block_id, version: 1,
        parent_id: $space_id, parent_table: 'space', alive: true,
        permissions: [{ type: 'user_permission', role: 'editor', user_id: this.user_id }],
        created_by_id: this.user_id,
        created_by_table: 'notion_user',
        created_time: Date.now(),
        last_edited_time: Date.now(),
        last_edited_by_table: 'notion_user',
        last_edited_by_id: this.user_id,
      }),
      userRootListAfter(this.user_id, ['space_views'], { id: $space_view_id }),
      spaceListAfter($space_id, ['pages'], { id: $block_id }),
    ]);
  }
}

export default Nishan;
