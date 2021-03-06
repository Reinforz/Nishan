import { NotionEndpoints } from '@nishans/endpoints';
import { NotionCache } from '../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

describe(`initializeNotionCache`, () => {
	const get_spaces_response: any = {
		space_1: {
			user_root: {
				notion_user_1: {
					value: { id: 'notion_user_1' }
				}
			},
			space: {
				space_1: {
					value: {
						permissions: [
							{
								user_id: 'notion_user_1'
							},
							{
								user_id: 'notion_user_2'
							}
						]
					}
				}
			},
			block: {
				block_1: {
					value: { id: 'block_1' }
				}
			},
			collection: {
				collection_1: {
					value: { id: 'collection_1' }
				}
			}
		}
	};

	it(`Fetches external notion_user data,external user = 1`, async () => {
		const cache = NotionCache.createDefaultCache();
		const sync_record_values_response = {
			recordMap: {
				notion_user: {
					notion_user_2: {
						value: { id: 'notion_user_2' }
					}
				}
			}
		} as any;

		const getSpacesMock = jest
				.spyOn(NotionEndpoints.Queries, 'getSpaces')
				.mockImplementationOnce(async () => get_spaces_response),
			constructAndSyncRecordsParamsMock = jest
				.spyOn(NotionCache, 'constructAndSyncRecordsParams')
				.mockImplementationOnce(async () => sync_record_values_response);

		await NotionCache.initializeNotionCache({ token: 'token', cache, user_id: 'user_root_1' });

		expect(getSpacesMock.mock.calls[0][0]).toStrictEqual(expect.objectContaining({ token: 'token' }));
		expect(constructAndSyncRecordsParamsMock.mock.calls[0][0]).toStrictEqual([ [ 'notion_user_2', 'notion_user' ] ]);
	});

	it(`Fetches external notion_user data,external user = 0`, async () => {
		get_spaces_response.space_1.space.space_1.value.permissions.pop();
		const cache = NotionCache.createDefaultCache();
		const sync_record_values_response = {
			recordMap: {
				notion_user: {
					notion_user_2: {
						value: { id: 'notion_user_2' }
					}
				}
			}
		} as any;

		const getSpacesMock = jest
				.spyOn(NotionEndpoints.Queries, 'getSpaces')
				.mockImplementationOnce(async () => get_spaces_response),
			constructAndSyncRecordsParamsMock = jest
				.spyOn(NotionCache, 'constructAndSyncRecordsParams')
				.mockImplementationOnce(async () => sync_record_values_response);

		await NotionCache.initializeNotionCache({ token: 'token', cache, user_id: 'user_root_1' });

		expect(getSpacesMock.mock.calls[0][0]).toStrictEqual(expect.objectContaining({ token: 'token' }));
		expect(constructAndSyncRecordsParamsMock).not.toHaveBeenCalled();
	});
});
