import { INotionUser } from '@nishans/types';
import { NotionUser } from '../src';
import { USER_ONE, nishan } from './constants';
import { TestInfo } from './types';
import { checkMultiple, checkSingle } from './utils/checker';
import { amount_arr, result_arr, way_arr } from './utils/testinfos';

it('Sets up default configuration for Nishan', () => {
	expect(nishan.interval).toBe(500);
});

const info: TestInfo<INotionUser, NotionUser, ['getNotionUser', 'getNotionUsers']> = {
	single: {
		correct: {
			id: USER_ONE.id.correct,
			cb: (user) => user.id === USER_ONE.id.correct
		},
		incorrect: {
			id: USER_ONE.id.incorrect,
			cb: (user) => user.id === USER_ONE.id.incorrect
		},
		method: 'getNotionUser',
		checker: checkSingle
	},
	multiple: {
		correct: {
			id: [ USER_ONE.id.correct ],
			cb: (user) => user.id === USER_ONE.id.correct
		},
		incorrect: {
			id: [ USER_ONE.id.incorrect ],
			cb: (user) => user.id === USER_ONE.id.incorrect
		},
		method: 'getNotionUsers',
		checker: checkMultiple
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
