import { ICache } from '@nishans/cache';
import { IOperation, TDataType } from '@nishans/types';
import { Predicate } from './utils';

export type TMethodType = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';

export type Logger = false | ((method: TMethodType, subject: TDataType, id: string) => void);
export interface NishanArg {
	token: string;
	interval: number;
	user_id: string;
	shard_id: number;
	space_id: string;
	cache: ICache;
	id: string;
	logger?: Logger;
	stack: IOperation[];
}

export type FilterTypes<T> = undefined | string[] | Predicate<T>;
export type FilterType<T> = undefined | string | Predicate<T>;
export type UpdateTypes<T1, T2> =
	| [string, T2][]
	| ((T: T1, index: number) => Promise<T2> | T2 | void | null | undefined);
export type UpdateType<T1, T2> = [string, T2] | ((T: T1, index: number) => Promise<T2> | T2 | void | null | undefined);

export interface IterateOptions<T, C> {
	/**
   * The data type of the child
   */
	child_type: TDataType;
	/**
   * A container of child ids or a key of the parent that stores the child ids
   */
	child_ids: string[] | keyof T;
	/**
   * Matches multiple based on the value
   */
	multiple?: boolean;
	/**
   * A container that stores the data
   */
	container: C;

	initialize_cache?: boolean;
}

export interface IterateAndGetOptions<T, C> extends IterateOptions<T, C> {}

export type IterateAndDeleteOptions<T, C> = IterateOptions<T, C> &
	(
		| {
				/**
 * Whether or not the user will manually handle all the mutations
 */
				manual: true;
				/**
 * The key of the parent which contains the child ids
 */
				child_path?: keyof T;
			}
		| {
				manual?: false;
				child_path: keyof T;
			});

export type IterateAndUpdateOptions<T, C> = IterateOptions<T, C> & {
	/**
   * Whether or not the user will manually handle all the mutations
   */
	manual?: boolean;
};

export type IterateChildren<TD = any, RD = any> =
	| {
			args: FilterTypes<TD>;
			cb: (id: string, data: TD) => any;
			method: 'READ' | 'DELETE';
		}
	| {
			args: UpdateTypes<TD, RD>;
			cb: (id: string, data: TD, updated_data: RD) => any;
			method: 'UPDATE';
		};

export interface IterateChildrenOptions<T, C> extends IterateOptions<T, C>, Pick<NishanArg, 'cache'> {
	parent_type: TDataType;
	parent_id: string;
	logger?: Logger;
}
export interface IterateAndGetChildrenOptions<T, C> extends IterateChildrenOptions<T, C>, IterateAndGetOptions<T, C> {}

export type IterateAndUpdateChildrenOptions<T, C> = Pick<NishanArg, 'stack' | 'user_id'> &
	IterateAndUpdateOptions<T, C> &
	IterateChildrenOptions<T, C>;
export type IterateAndDeleteChildrenOptions<T, C> = Pick<NishanArg, 'stack' | 'user_id'> &
	IterateAndDeleteOptions<T, C> &
	IterateChildrenOptions<T, C>;
