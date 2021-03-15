import { INotionFabricatorOptions } from '@nishans/fabricator';
import { TDataType } from '@nishans/types';
export interface INotionCoreOptions extends INotionFabricatorOptions {
	id: string;
}

export interface IterateChildrenOptions<T, C> extends IterateOptions<T, C>, Pick<INotionCoreOptions, 'cache'> {
	parent_type: TDataType;
	parent_id: string;
	logger?: boolean;
}
export interface IterateAndGetChildrenOptions<T, C> extends IterateChildrenOptions<T, C>, IterateAndGetOptions<T, C> {}
export type IterateAndUpdateChildrenOptions<T, C> = Omit<INotionCoreOptions, 'id'> &
	IterateAndUpdateOptions<T, C> &
	IterateChildrenOptions<T, C>;
export type IterateAndDeleteChildrenOptions<T, C> = Omit<INotionCoreOptions, 'id'> &
	IterateAndDeleteOptions<T, C> &
	IterateChildrenOptions<T, C>;
