import { INotionUser } from '@nishans/types';
import { NotionUser } from '../src';
import { TEST_DATA, nishan } from './constants';
import { TestInfo } from './types';
import { checkMultiple, checkSingle } from './utils/checker';
import { amount_arr, result_arr, way_arr } from './utils/testinfos';

it('Sets up default configuration for Nishan', () => {
	expect(nishan.interval).toBe(500);
});

const info: TestInfo<INotionUser, NotionUser, ['getNotionUser', 'getNotionUsers']> = {
	single: {
		correct: {
			id: TEST_DATA.notion_user[0].id.correct,
			cb: (user) => user.id === TEST_DATA.notion_user[0].id.correct
		},
		incorrect: {
			id: TEST_DATA.notion_user[0].id.incorrect,
			cb: (user) => user.id === TEST_DATA.notion_user[0].id.incorrect
		},
		method: 'getNotionUser',
		checker: checkSingle(TEST_DATA.notion_user[0])
	},
	multiple: {
		correct: {
			id: [ TEST_DATA.notion_user[0].id.correct ],
			cb: (user) => user.id === TEST_DATA.notion_user[0].id.correct
		},
		incorrect: {
			id: [ TEST_DATA.notion_user[0].id.incorrect ],
			cb: (user) => user.id === TEST_DATA.notion_user[0].id.incorrect
		},
		method: 'getNotionUsers',
		checker: checkMultiple(TEST_DATA.notion_user[0])
	}
};

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
