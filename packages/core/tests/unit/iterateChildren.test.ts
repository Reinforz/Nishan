import { ISpace, ISpaceView, IUserRoot, TPage } from '@nishans/types';
import { ITPage } from '../../dist/types';
import { createPageMap, iterateAndGetChildren } from '../../dist/utils';
import { nishan, SPACE_ONE_ID, USER_ONE_ID } from '../constants';
import data from '../data';

const { cache } = nishan;

describe('iterateAndGetChildren function works property', () => {
	describe('Callback returns all children', () => {
		describe('Returns correct child from cache', () => {
			it('Check within the callback', async () => {
				const child_ids = data.recordMap.space[SPACE_ONE_ID].value.pages;
				iterateAndGetChildren<ISpace, TPage, ITPage>(
					(page) => {
						expect(child_ids.includes(page.id)).toBeTruthy();
						return true;
					},
					(id) => cache.block.get(id) as TPage,
					{
						parent_id: SPACE_ONE_ID,
						parent_type: 'space',
						child_type: 'block',
						child_ids,
						container: createPageMap(),
						cache
					}
				);
			});

			it('Check the returned array', async () => {
				const child_ids = data.recordMap.space[SPACE_ONE_ID].value.pages;
				const children = await iterateAndGetChildren<ISpace, TPage, TPage[]>(
					() => true,
					(id) => cache.block.get(id) as TPage,
					{
						parent_id: SPACE_ONE_ID,
						parent_type: 'space',
						child_type: 'block',
						child_ids,
						container: [],
						cache
					},
					(id, data, pages) => pages.push(data)
				);
				expect(children.length).toBe(2);
			});
		});

		describe('Returns incorrect child from cache', () => {
			it('Check within the callback', async () => {
				const child_ids = data.recordMap.user_root[USER_ONE_ID].value.space_views;
				iterateAndGetChildren<IUserRoot, ISpaceView, ITPage>(
					(child) => {
						expect(child).toBeFalsy();
						return true;
					},
					(id) => cache.block.get(id) as any,
					{
						parent_id: USER_ONE_ID,
						parent_type: 'user_root',
						container: createPageMap(),
						child_type: 'space_view',
						child_ids,
						cache
					}
				);
			});

			it('Check the returned array', async () => {
				const child_ids = data.recordMap.user_root[USER_ONE_ID].value.space_views;
				const children = await iterateAndGetChildren<IUserRoot, ISpaceView, TPage[]>(
					() => true,
					(id) => cache.block.get(id) as any,
					{
						parent_id: USER_ONE_ID,
						container: [],
						parent_type: 'user_root',
						child_type: 'space_view',
						child_ids,
						cache
					}
				);
				expect(children.length).toBe(0);
			});
		});
	});
});
