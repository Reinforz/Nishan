import { IOperation } from '@nishans/types';
import { NotionOperationsObject } from './OperationsObject';
import { NotionOperationPluginFunction } from './types';

export class NotionOperationsClass {
  #plugins: NotionOperationPluginFunction[];
	space_id: string;
	shard_id: number;
	token: string;
	user_id: string;

	constructor (args: { user_id: string, token: string; space_id: string; shard_id: number; notion_operation_plugins?: NotionOperationPluginFunction[] }) {
		this.space_id = args.space_id;
		this.shard_id = args.shard_id;
		this.token = args.token;
    this.#plugins = args.notion_operation_plugins ?? [];
    this.user_id = args.user_id;
	}

  getPlugins(){
    return this.#plugins;
  }

  /**
   * Applies all the plugins in the class to all the operations in the stack
   */
  applyPluginsToOperationsStack(operations: IOperation[]){
    return NotionOperationsObject.applyPluginsToOperationsStack(operations, this.#plugins);
  }

  /**
   * Execute the operations present in the operations stack
   */
	async executeOperations (operations: IOperation[]) {
    await NotionOperationsObject.executeOperations(operations, {
      notion_operation_plugins: this.#plugins,
      token: this.token,
      user_id: this.user_id,
      shard_id: this.shard_id,
      interval: 0,
      space_id: this.space_id,
    });
	}
}
