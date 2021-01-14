import { ISpace, ISpaceView, IUserRoot, TPage } from '@nishans/types';
import { iterateAndGetChildren } from '../../dist/utils';
import { nishan, SPACE_ONE_ID, USER_ONE_ID } from '../constants';
import data from '../data';

const { cache } = nishan;

describe('iterateAndGetChildren function works property', () => {
	it('Check when cache returns correct child', async () => {
		const child_ids = data.recordMap.space[SPACE_ONE_ID].value.pages;
		iterateAndGetChildren<ISpace, TPage>(
			(page) => {
				expect(child_ids.includes(page.id)).toBeTruthy();
			},
			(id) => cache.block.get(id) as TPage,
			{
				parent_id: SPACE_ONE_ID,
				parent_type: 'space',
				child_type: 'block',
				child_ids,
				cache
			}
		);
	});

	it('Check when cache returns wrong child', async () => {
		const child_ids = data.recordMap.user_root[USER_ONE_ID].value.space_views;
		iterateAndGetChildren<IUserRoot, ISpaceView>(
			(child) => {
				expect(child).toBeFalsy();
			},
			(id) => cache.block.get(id) as any,
			{
				parent_id: USER_ONE_ID,
				parent_type: 'user_root',
				child_type: 'space_view',
				child_ids,
				cache
			}
		);
	});
});
