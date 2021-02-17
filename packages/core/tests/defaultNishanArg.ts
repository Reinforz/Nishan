import { NishanArg } from '../types';
import { createDefaultCache } from './createDefaultCache';

export const default_nishan_arg: NishanArg = {
	cache: createDefaultCache(),
	id: 'block_1',
	interval: 0,
	shard_id: 123,
	space_id: 'space_1',
	stack: [],
	token: 'token',
	user_id: 'user_root_1'
};
