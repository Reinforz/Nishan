import { NotionConstants } from '@nishans/constants';
import { Args, IOperation, TDataType, TOperationCommand } from '@nishans/types';

export const NotionOperationsChunk: Record<
	TDataType,
	Record<TOperationCommand, ((id: string, path: string[], args: Args) => IOperation)>
> = {} as any;

/** 
 * Constructing the Operations object using the list of tables and commands
 */
NotionConstants.data_types().forEach((table) => {
	NotionOperationsChunk[table] = {} as any;
	NotionConstants.operation_commands().forEach((command) => {
		NotionOperationsChunk[table][command] = (id: string, path: string[], args: Args): IOperation => {
			return {
				pointer: {
					table,
					id
				},
				path,
				command,
				args
			};
		};
	});
});
