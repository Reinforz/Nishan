import { ISpace } from '@nishans/types';
import { NotionUser, Space } from '../src';
import { nishan, TEST_DATA } from './constants';
import { cycleThroughInfoarr } from './utils/cycleThroughInfoarr';
import { generateTestInfo } from './utils/generateTestInfo';

let user: NotionUser = null as any;

beforeAll(async () => {
	user = await nishan.getNotionUser(TEST_DATA.notion_user[0].id.correct);
	user.init_cache = true;
});

const info = generateTestInfo<ISpace, Space, ['getSpace', 'getSpaces']>([ 'getSpace', 'getSpaces' ], TEST_DATA.space);

cycleThroughInfoarr((amount, result, way) => {
	const msg = `Get ${amount} ${result} space using ${result} ${way}`;
	it(msg, async () => {
		info[amount].checker(await (user as any)[info[amount].method](info[amount][result][way]), result);
	});
});

it('Get user_settings', () => {
	const user_settings = user.getUserSettings();
	expect(user_settings).not.toBeNull();
	expect(user_settings.id).toBe(TEST_DATA.notion_user[0].data.id);
	expect(user_settings.type).toBe('user_settings');
});

it('Get user_root', () => {
	const user_root = user.getUserRoot();
	expect(user_root).not.toBeNull();
	expect(user_root.id).toBe(TEST_DATA.notion_user[0].data.id);
	expect(user_root.type).toBe('user_root');
});
