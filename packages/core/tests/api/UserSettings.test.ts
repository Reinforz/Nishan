import { NotionCache } from '@nishans/cache';
import { NotionData, UserSettings } from '../../libs';
import { default_nishan_arg } from '../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`update`, () => {
	const cache = NotionCache.createDefaultCache();

	const user_settings = new UserSettings({
		...default_nishan_arg,
		cache,
		id: 'user_1'
	});

	const updateCacheLocallyMock = jest
		.spyOn(NotionData.prototype, 'updateCacheLocally')
		.mockImplementationOnce(async () => undefined);

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
