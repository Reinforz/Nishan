import { INotionOperationOptions } from '@nishans/operations';
import { INotionCache, Predicate, TDataType } from '@nishans/types';

export type FilterTypes<T> = undefined | string[] | Predicate<T>;
export type FilterType<T> = undefined | string | Predicate<T>;
export type UpdateTypes<T1, T2> =
  | [string, T2][]
  | ((T: T1, index: number) => Promise<T2> | T2 | void | null | undefined);
export type UpdateType<T1, T2> =
  | [string, T2]
  | ((T: T1, index: number) => Promise<T2> | T2 | void | null | undefined);

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

export type IterateAndDeleteOptions<T, C> = IterateOptions<T, C> & {
  manual?: boolean;
  child_path?: keyof T;
};

export type IterateAndUpdateOptions<T, C> = IterateOptions<T, C> & {
  /**
   * Whether or not the user will manually handle all the NotionMutations
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

export interface IterateChildrenOptions<T, C> extends IterateOptions<T, C> {
  parent_type: TDataType;
  parent_id: string;
  logger?: boolean;
  cache: INotionCache;
  space_id: string;
}
export interface IterateAndGetChildrenOptions<T, C>
  extends IterateChildrenOptions<T, C>,
    IterateAndGetOptions<T, C> {}
export type IterateAndUpdateChildrenOptions<T, C> = INotionOperationOptions &
  IterateAndUpdateOptions<T, C> &
  IterateChildrenOptions<T, C>;
export type IterateAndDeleteChildrenOptions<T, C> = INotionOperationOptions &
  IterateAndDeleteOptions<T, C> &
  IterateChildrenOptions<T, C>;
