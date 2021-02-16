import { IOperation } from '@nishans/types';
import { NotionData, UserSettings } from '../../src';
import { createDefaultCache } from '../../utils/createDefaultCache';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`update`, () => {
	const cache = createDefaultCache(),
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

	const updateCacheLocallyMock = jest.spyOn(NotionData.prototype, 'updateCacheLocally').mockImplementationOnce(() => {
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
