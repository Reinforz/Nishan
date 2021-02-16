import { ICache } from '@nishans/cache';
import { IOperation } from '@nishans/types';
import { UserSettings } from '../src';
import Data from '../src/Data';

afterEach(() => {
	jest.clearAllMocks();
});

it(`update`, () => {
	const cache: ICache = {
			block: new Map(),
			collection: new Map(),
			collection_view: new Map(),
			notion_user: new Map(),
			space: new Map(),
			space_view: new Map(),
			user_root: new Map(),
			user_settings: new Map()
		},
		stack: IOperation[] = [];

	const user_settings = new UserSettings({
		cache,
		id: 'user_1',
		stack,
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		token: 'token',
		user_id: 'user_1'
	});

	const updateCacheLocallyMock = jest.spyOn(Data.prototype, 'updateCacheLocally').mockImplementationOnce(() => {
		return {} as any;
	});

	user_settings.update({
		locale: 'en-US',
		start_day_of_week: 1
	});

	expect(updateCacheLocallyMock).toHaveBeenCalledTimes(1);
	expect(updateCacheLocallyMock).toHaveBeenCalledWith(
		{
			locale: 'en-US',
			start_day_of_week: 1
		},
		[ 'start_day_of_week', 'time_zone', 'locale', 'preferred_locale', 'preferred_locale_origin' ]
	);
});
