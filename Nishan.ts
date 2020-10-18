
import { IPage, ISpace, NishanArg, TBlock } from "./types";
import { error, warn } from "./utils/logs";
import Page from "./api/Page";
import Block from "./api/Block";
import Space from "./api/Space";
import Collection from "./api/Collection";
import Getters from "./api/Getters";
import createTransaction from "./utils/createTransaction";

class Nishan extends Getters {
  constructor(arg: NishanArg) {
    super(arg);
  }

  /**
   * Return a new block by its id
   * @param block_id The id of the block to obtain
   */
  async getBlock(block_id: string): Promise<Block<TBlock>> {
    const cache_data = this.cache.block.get(block_id);
    if (cache_data) return new Block({ block_data: cache_data, ...this.getProps() });
    const recordMap = await this.getBacklinksForBlock(block_id);
    const target = recordMap.block[block_id];
    if (!target)
      throw new Error(error(`No block with the id ${block_id} exists`));
    if (!this.user_id || !this.space_id || !this.shard_id)
      throw new Error(error(`UserId, SpaceId or ShardId is null`));
    else
      return new Block({
        block_data: target.value,
        ...this.getProps()
      });
  }

  async init(arg: string | ((space: ISpace) => boolean)) {
    await this.loadUserContent();
    const space = await this.getSpace(arg);
    return space;
  }

  /**
   * Obtain a collection using its id
   * @param collection_id The id of the collection to obtain
   */
  async getCollection(collection_id: string) {
    const { collection } = await this.syncRecordValues([
      {
        id: collection_id,
        table: 'collection',
        version: -1
      }
    ]);

    const collection_data = collection[collection_id].value;

    if (!this.user_id || !this.space_id || !this.shard_id)
      throw new Error(error(`UserId, SpaceId or ShardId is null`));
    else
      return new Collection({
        ...this.getProps(),
        collection_data
      });
  }

  /**
   * Obtain a page using the passed id
   * @param page_id Id of the page to obtain 
   */
  async getPage(page_id: string) {
    const cache_data = this.cache.block.get(page_id) as IPage;
    if (cache_data) return new Page({
      block_data: cache_data,
      ...this.getProps()
    });

    const { block } = await this.getBacklinksForBlock(page_id);
    const target = block[page_id].value as IPage;

    if (!target)
      throw new Error(warn(`No page with the id ${page_id} exists`));
    if (target.type !== "page")
      throw new Error(warn(`The target block is not a page,but rather a ${target.type} type`));

    return new Page(
      {
        block_data: target,
        ...this.getProps()
      }
    );
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

  /**
   * The the internal space of the instance using a predicate or string id
   * @param arg A string representing the space id or a predicate function
   */
  async setSpace(arg: string | ((space: ISpace) => boolean)) {
    const { space } = await this.loadUserContent();

    const target_space = (Object.values(space).find((space) => typeof arg === "string" ? space.value.id === arg : arg(space.value))?.value || Object.values(space)[0].value);
    if (!target_space) throw new Error(error(`No space matches the criteria`));
    else {
      this.shard_id = target_space.shard_id;
      this.space_id = target_space.id;
      this.user_id = target_space.permissions[0].user_id;
      this.createTransaction = createTransaction.bind(this, target_space.shard_id, target_space.id);
    }
  }

  /**
   * Sets the root user of the instance
   */
  async setRootUser() {
    const { user_root } = await this.loadUserContent();
    this.user_id = Object.values(user_root)[0].value.id;
  }
}

export default Nishan;
