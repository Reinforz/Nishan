import {
	TBlock,
	ICollection,
	TView,
	ISpace,
	INotionUser,
	ISpaceView,
	IUserRoot,
	IUserSettings,
	IOperation,
	TDataType
} from '@nishans/types';
import { Predicate } from './utils';

export type UpdateCacheManuallyParam = (string | [string, TDataType])[];

export interface ICache {
	block: Map<string, TBlock>;
	collection: Map<string, ICollection>;
	collection_view: Map<string, TView>;
	space: Map<string, ISpace>;
	notion_user: Map<string, INotionUser>;
	space_view: Map<string, ISpaceView>;
	user_root: Map<string, IUserRoot>;
	user_settings: Map<string, IUserSettings>;
}

export type TSubjectType =
	| 'NotionUser'
	| 'View'
	| 'Block'
	| 'Space'
	| 'UserSettings'
	| 'UserRoot'
	| 'SchemaUnit'
	| 'Page'
	| 'CollectionView'
	| 'CollectionViewPage'
	| 'Collection'
	| 'SpaceView';

export type TMethodType = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';

export type Logger = false | ((method: TMethodType, subject: TSubjectType, id: string) => void);
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
