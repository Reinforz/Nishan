import { enqueueTask, findUser, inviteGuestsToSpace } from "@nishans/endpoints";
import { IPage, ISpace, ISpaceView, TExportType, TBlock, INotionUser, IPermission, IPublicPermission, IPublicPermissionOptions, ISpacePermission, TPermissionRole, TPublicPermissionRole, TSpacePermissionRole } from "@nishans/types";

import { NishanArg, TBlockCreateInput, FilterType, FilterTypes, UpdateType, TBlockInput, UpdateTypes, ITBlock, IPageCreateInput } from "../types";
import { createBlockClass, createBlockMap, error, nestedContentPopulate, Operation } from "../utils";
import Block from "./Block";


/**
 * A class to represent Page type block of Notion
 * @noInheritDoc
 */

export default class Page extends Block<IPage, IPageCreateInput> {
  constructor(arg: NishanArg) {
    super(arg);
  }

  getCachedParentData() {
    const data = this.getCachedData();
    if (data.parent_table === "space") return this.cache.space.get(data.parent_id) as ISpace;
    else return this.cache.block.get(data.parent_id) as IPage;
  }

  /* async upload() {
    const res = await this.getUploadFileUrl({
      bucket: "secure",
      contentType: "image/jpeg",
      name: "68sfghkgmvd51.jpg"
    });

    const file_url_chunks = res.url.split("/");
    const file_id = file_url_chunks[file_url_chunks.length - 2];

    await axios.put(res.signedPutUrl);
    await this.createContent({
      type: "image",
      properties: {
        source: [[res.url]]
      },
      format: {
        display_source: res.url
      },
      file_ids: file_id
    } as IImageInput & { file_ids: string });
  } */

  /**
   * Add/remove this page from the favourite list
   */
  async toggleFavourite() {
    const data = this.getCachedData();
    let target_space_view: ISpaceView = null as any;
    for (const [, space_view] of this.cache.space_view) {
      if (space_view.space_id === data.space_id) {
        target_space_view = space_view;
        break;
      }
    };

    let is_bookmarked = false;
    if(target_space_view.bookmarked_pages){
      is_bookmarked = target_space_view.bookmarked_pages?.includes(data.id);
      if(is_bookmarked)
        target_space_view.bookmarked_pages = target_space_view.bookmarked_pages.filter(id=>id !== this.id);
      else target_space_view.bookmarked_pages.push(this.id);
    }

    this.stack.push(
      (is_bookmarked ? Operation.space_view.listRemove : Operation.space_view.listBefore)(target_space_view.id, ["bookmarked_pages"], {
        id: data.id
      })
    )
  }

  /**
   * Export the page and its content as a zip
   * @param arg Options used for setting up export
   */
  // ? FEAT:2:M Add export block method (maybe create a separate class for it as CollectionBlock will also support it)
  async export(arg: Partial<{
    timeZone: string,
    recursive: boolean,
    exportType: TExportType
  }>) {
    const data = this.getCachedData();
    const {
      timeZone = "", recursive = true, exportType = "markdown"
    } = arg;
    const {
      taskId
    } = await enqueueTask({
      task: {
        eventName: 'exportBlock',
        request: {
          blockId: data.id,
          exportOptions: {
            exportType,
            locale: "en",
            timeZone
          },
          recursive
        }
      }
    }, {
      token: this.token,
      interval: this.interval
    });

    /* await this.getTasks({taskIds: [taskId]});

    const response = await axios.get(results[0].status.exportURL, {
      responseType: 'arraybuffer'
    });

    return response.data; */
  }

  /**
   * Batch add multiple block as contents
   * @param contents array of options for configuring each content
   * @returns Array of newly created block content objects
   */
  async createBlocks(contents: TBlockCreateInput[]) {
    return await nestedContentPopulate(contents, this.id, this.type as "block", this.getProps(), this.id)
  }

  async getBlock(arg?: FilterType<TBlock>) {
    return await this.getBlocks(typeof arg === "string" ? [arg] : arg, false);
  }

  /**
   * Get all the blocks of the page as an object
   * @returns An array of block object
   */
  async getBlocks(args?: FilterTypes<TBlock>, multiple?: boolean) {
    return await this.getIterate<TBlock, ITBlock>(args, { container: createBlockMap(), multiple, child_ids: "content", child_type: "block" }, (block_id) => this.cache.block.get(block_id) as TBlock, (_, block, block_map) => {
      const block_obj = createBlockClass(block.type, block.id, this.getProps());
      if(block.type === "page")
        block_map[block.type].set(block.properties.title[0][0], block_obj)
      else if(block.type === "collection_view" || block.type === "collection_view_page"){
        const collection = this.cache.collection.get(block.collection_id);
        if(collection)
          block_map[block.type].set(collection.name[0][0], block_obj)
      }
      block_map[block.type].set(block.id, block_obj)
    });
  }

  async updateBlock(args: UpdateType<TBlock, TBlockInput>) {
    return (await this.updateBlocks(typeof args === "function" ? args : [args],  false))
  }

  async updateBlocks(args: UpdateTypes<TBlock, TBlockInput>, multiple?: boolean) {
    return await this.updateIterate<TBlock, TBlockInput, ITBlock>(args, {
      multiple,
      child_ids: "content",
      child_type: "block",
      container: createBlockMap()
    }, (child_id) => this.cache.block.get(child_id), (_, block,__,block_map) => {
      const block_obj = createBlockClass(block.type, block.id, this.getProps());
      if(block.type === "page")
        block_map[block.type].set(block.properties.title[0][0], block_obj)
      else if(block.type === "collection_view" || block.type === "collection_view_page"){
        const collection = this.cache.collection.get(block.collection_id);
        if(collection)
          block_map[block.type].set(collection.name[0][0], block_obj)
      }
      block_map[block.type].set(block.id, block_obj)
    })
  }

  /**
   * Delete a single block from a page
   * @param arg id string or a predicate acting as a filter
   */
  async deleteBlock(arg?: FilterType<TBlock>) {
    return await this.deleteBlocks(typeof arg === "string" ? [arg] : arg,  false);
  }

  /**
   * Delete multiple blocks from a page
   * @param arg array of ids or a predicate acting as a filter
   */
  async deleteBlocks(args?: FilterTypes<TBlock>, multiple?: boolean) {
    await this.deleteIterate<TBlock>(args, {
      multiple,
      child_ids: 'content',
      child_path: "content",
      child_type: "block",
    }, (block_id) => this.cache.block.get(block_id));
  }

  async addSharedUser(email: string, role: TPermissionRole) {
    return (await this.addSharedUsers([[email, role]]))?.[0]
  }

  /**
   * Share page to users with specific permissions
   * @param args array of userid and role of user to share pages to
   */
  async addSharedUsers(args: [string, TPermissionRole][]) {
    const data = this.getCachedData(), notion_users: INotionUser[] = [];
    const permissionItems: IPermission[] = [];
    for (let i = 0; i < args.length; i++) {
      const [email, permission] = args[i];
      const { value } = await findUser({email}, this.getConfigs());
      if (!value?.value) error(`User does not have a notion account`);
      else{
        const { value: notion_user } = value;
        permissionItems.push({
          role: permission,
          type: "user_permission",
          user_id: notion_user.id
        });
        notion_users.push(notion_user)
      }
    }
    await inviteGuestsToSpace({
      blockId: data.id,
      permissionItems,
      spaceId: data.space_id
    },this.getConfigs());
    await this.updateCacheManually([this.id, [data.space_id, "space"]]);
    return notion_users;
  }

  /**
   * Update the role of the current user based on their id
   * @param id Id of the user to update
   * @param role new Role of the user to update
   */
  async updateSharedUser(id: string, role: TPermissionRole) {
    return this.updateSharedUsers([[id, role]]);
  }

  /**
   * Update the role of the current users based on their id
   * @param args array of array [id of the user, role type for the user]
   */
  updateSharedUsers(args: [string, TPermissionRole][] ) {
    const data = this.getCachedData();
    for (let index = 0; index < args.length; index++) {
      const arg = args[index];
      const permission_data: IPermission = { role: arg[1], type: "user_permission", user_id: arg[0] }
      this.stack.push({
        args: permission_data,
        command: "setPermissionItem",
        id: this.id,
        path: ["permissions"],
        table: "block"
      })
      data.permissions.push(permission_data)
    }
    this.updateLastEditedProps();
    this.stack.push(Operation[this.type].update(this.id, [], this.getLastEditedProps()));
  }

  /**
   * Remove a single user from the pages permission option
   * @param id Id of the user to remove from permission
   */
  removeSharedUser(id: string) {
    return this.removeSharedUsers([id]);
  }

  /**
   * Remove multiple users from the pages permission option
   * @param id array of the users id to remove from permission
   */
  removeSharedUsers(ids: string[]) {
    return this.updateSharedUsers(ids.map(id => [id, "none"]));
  }

  addPublicPermission(role: TPublicPermissionRole, options?: Partial<IPublicPermissionOptions> ) {
    this.updatePublicPermission(role, options)
  }

  updatePublicPermission(role: TPublicPermissionRole, options?: Partial<IPublicPermissionOptions>) {
    const data = this.getCachedData(), permission = data.permissions.find((permission) => permission.type === "public_permission") as IPublicPermission, permission_data: IPublicPermission = {
      ...(permission ?? {}),
      type: "public_permission",
      role,
      ...(options ?? {})
    };
    this.updateLastEditedProps();
    permission.role = role;
    permission.allow_duplicate = options?.allow_duplicate ?? permission.allow_duplicate;
    permission.allow_search_engine_indexing = options?.allow_search_engine_indexing ?? permission.allow_search_engine_indexing;
    
    this.stack.push(Operation.block.setPermissionItem(this.id, ["permissions"], permission_data))
  }

  removePublicPermission() {
    this.updatePublicPermission("none");
  }

  updateSpacePermission(role: TSpacePermissionRole) {
    const data = this.getCachedData(), permission = data.permissions.find((permission) => permission.type === "public_permission") as ISpacePermission;
    permission.role = role;
    this.updateLastEditedProps();
    this.stack.push(Operation.block.setPermissionItem(this.id, ["permissions"], {
      type: "space_permission",
      role,
    }))
  }

  removeSpacePermission() {
    this.updateSpacePermission("none")
  }
}