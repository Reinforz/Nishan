import { INotionUser } from '@nishans/types';
import { NotionUser } from '../src';
import { TEST_DATA, nishan } from './constants';
import { generateTestInfo } from './utils/generateTestInfo';
import { amount_arr, result_arr, way_arr } from './utils/testinfos';

it('Sets up default configuration for Nishan', () => {
	expect(nishan.interval).toBe(500);
});

const info = generateTestInfo<INotionUser, NotionUser, ['getNotionUser', 'getNotionUsers']>(
	[ 'getNotionUser', 'getNotionUsers' ],
	TEST_DATA.notion_user
);

amount_arr.map((amount) => {
	result_arr.map((result) => {
		way_arr.map((way) => {
			const msg = `Get ${amount} ${result} notion_user using ${result} ${way}`;
			it(msg, async () => {
				info[amount].checker(await (nishan as any)[info[amount].method](info[amount][result][way]), result);
			});
		});
	});
});
