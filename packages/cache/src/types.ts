import { TBlock, ICollection, TView, ISpace, INotionUser, ISpaceView, IUserRoot, IUserSettings } from '@nishans/types';

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

export interface CtorArgs {
	token: string;
	interval?: number;
	user_id?: string;
	shard_id: number;
	space_id: string;
	cache?: ICache;
}

export interface Configs {
	token: string;
	user_id?: string;
	interval?: number;
}
