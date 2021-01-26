import { INotionUser } from '@nishans/types';
import { NotionUser } from '../dist/src';
import { USER_ONE, nishan } from './constants';

type TAmount = 'single' | 'multiple';
type TResult = 'correct' | 'incorrect';

interface TestInfo<D, C, M extends [string, string]> {
	single: {
		correct: {
			id: string;
			cb: (data: D) => any;
		};
		incorrect: {
			id: string;
			cb: (data: D) => any;
		};
		method: M[0];
		checker: (data: C, result: TResult) => void;
	};
	multiple: {
		correct: {
			id: [string];
			cb: (data: D) => any;
		};
		incorrect: {
			id: [string];
			cb: (data: D) => any;
		};
		method: M[1];
		checker: (data: C[], result: TResult) => void;
	};
}

function checkUser (user: NotionUser, result: TResult) {
	if (result === 'correct') {
		expect(user).not.toBeNull();
		expect(user.id).toBe(USER_ONE.id.correct);
		expect(user.type).toBe('notion_user');
	} else {
		expect(user).toBeUndefined();
	}
}

function checkUsers (users: NotionUser[], result: TResult) {
	if (result === 'correct') {
		expect(users.length).toBe(1);
		expect(users[0]).not.toBeNull();
		expect(users[0].id).toBe(USER_ONE.id.correct);
		expect(users[0].type).toBe('notion_user');
	} else {
		expect(users.length).toBe(0);
		expect(users[0]).toBeUndefined();
	}
}

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
		checker: checkUser
	},
	multiple: {
		correct: {
			id: [ USER_ONE.id.correct ],
			cb: (user: any) => user.id === USER_ONE.id.correct
		},
		incorrect: {
			id: [ USER_ONE.id.incorrect ],
			cb: (user: any) => user.id === USER_ONE.id.incorrect
		},
		method: 'getNotionUsers',
		checker: checkUsers
	}
};

[ 'single', 'multiple' ].map((amount) => {
	[ 'correct', 'incorrect' ].map((result) => {
		[ 'id', 'cb' ].map((way) => {
			const msg = `Get ${amount} ${result} notion_user using ${result} ${way}`;
			it(msg, async () => {
				info[amount].checker(await (nishan as any)[info[amount].method](info[amount][result][way]), result);
			});
		});
	});
});
