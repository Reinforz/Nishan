import { ICache } from '@nishans/endpoints';
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
	logger: Logger;
	stack: IOperation[];
}

export type FilterTypes<T> = undefined | string[] | Predicate<T>;
export type FilterType<T> = undefined | string | Predicate<T>;
export type UpdateTypes<T1, T2> =
	| [string, T2][]
	| ((T: T1, index: number) => Promise<T2> | T2 | void | null | undefined);
export type UpdateType<T1, T2> = [string, T2] | ((T: T1, index: number) => Promise<T2> | T2 | void | null | undefined);
