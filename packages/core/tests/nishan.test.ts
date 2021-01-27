import { INotionUser } from '@nishans/types';
import { NotionUser } from '../src';
import { TEST_DATA, nishan } from './constants';
import { cycleThroughInfoarr } from './utils/cycleThroughInfoarr';
import { generateTestInfo } from './utils/generateTestInfo';

it('Sets up default configuration for Nishan', () => {
	expect(nishan.interval).toBe(500);
});

const info = generateTestInfo<INotionUser, NotionUser, ['getNotionUser', 'getNotionUsers']>(
	[ 'getNotionUser', 'getNotionUsers' ],
	TEST_DATA.notion_user
);

cycleThroughInfoarr((amount, result, way) => {
	const msg = `Get ${amount} ${result} notion_user using ${result} ${way}`;
	it(msg, async () => {
		info[amount].checker(await (nishan as any)[info[amount].method](info[amount][result][way]), result);
	});
});
