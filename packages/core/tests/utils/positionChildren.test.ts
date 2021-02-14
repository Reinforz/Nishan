import { IPage } from '@nishans/types';
import deepEqual from 'deep-equal';
import { positionChildren } from '../../src';

describe('positionChildren', () => {
	it(`Should work when parent doesnot contain container`, () => {
		const parent: IPage = { type: 'page', id: 'parent_id' } as any;
		delete (parent as any).content;
		const operation = positionChildren({
			parent,
			child_id: 'child_id',
			position: 0,
			parent_type: 'block'
		});

		expect(parent.content[0]).toBe('child_id');

		expect(
			deepEqual(operation, {
				path: [ 'content' ],
				table: 'block',
				command: 'listAfter',
				args: {
					after: '',
					id: 'child_id'
				},
				id: 'parent_id'
			})
		).toBe(true);
	});

	it(`Should work when position is a number`, () => {
		const parent: IPage = { type: 'page', id: 'parent_id', content: [ 'child_1_id' ] } as any;
		const operation = positionChildren({
			parent,
			child_id: 'child_id',
			position: 0,
			parent_type: 'block'
		});

		expect(parent.content[0]).toBe('child_id');
		expect(
			deepEqual(operation, {
				path: [ 'content' ],
				table: 'block',
				command: 'listBefore',
				args: {
					before: 'child_1_id',
					id: 'child_id'
				},
				id: 'parent_id'
			})
		).toBe(true);
	});

	it(`Should push to last if position not provided`, () => {
		const parent: IPage = { type: 'page', id: 'parent_id', content: [] } as any;
		const operation = positionChildren({
			parent,
			child_id: 'child_id',
			parent_type: 'block'
		});

		expect(parent.content.pop()).toBe('child_id');
		expect(
			deepEqual(operation, {
				path: [ 'content' ],
				table: 'block',
				command: 'listAfter',
				args: {
					after: '',
					id: 'child_id'
				},
				id: 'parent_id'
			})
		).toBe(true);
	});

	it(`Should work when position is an object(position: After)`, () => {
		const parent: IPage = { type: 'page', id: 'parent_id', content: [ 'child_1_id' ] } as any;
		const operation = positionChildren({
			logger: () => {
				return;
			},
			position: {
				id: 'child_1_id',
				position: 'After'
			},
			parent,
			child_id: 'child_id',
			parent_type: 'block'
		});

		expect(deepEqual(parent.content, [ 'child_1_id', 'child_id' ])).toBe(true);
		expect(
			deepEqual(operation, {
				path: [ 'content' ],
				table: 'block',
				command: 'listAfter',
				args: {
					after: 'child_1_id',
					id: 'child_id'
				},
				id: 'parent_id'
			})
		).toBe(true);
	});

	it(`Should work when position is an object(position: Before)`, () => {
		const parent: IPage = { type: 'page', id: 'parent_id', content: [ 'child_1_id' ] } as any;
		const operation = positionChildren({
			position: {
				id: 'child_1_id',
				position: 'Before'
			},
			parent,
			child_id: 'child_id',
			parent_type: 'block'
		});

		expect(deepEqual(parent.content, [ 'child_id', 'child_1_id' ])).toBe(true);

		expect(
			deepEqual(operation, {
				path: [ 'content' ],
				table: 'block',
				command: 'listBefore',
				args: {
					before: 'child_1_id',
					id: 'child_id'
				},
				id: 'parent_id'
			})
		).toBe(true);
	});

	it(`Should throw an error if the pivot and content doesnt exist for number position`, () => {
		const parent: IPage = { type: 'page', id: 'parent_id' } as any;
		delete (parent as any).content;
		expect(() =>
			positionChildren({
				parent,
				child_id: 'child_id',
				position: 3,
				parent_type: 'block'
			})
		).toThrow(`Parent doesnot contain any children at index 3`);
	});

	it(`Should throw an error if the pivot doesnt exist for number position`, () => {
		const parent: IPage = { type: 'page', id: 'parent_id', content: [] } as any;
		expect(() =>
			positionChildren({
				parent,
				child_id: 'child_id',
				position: 3,
				parent_type: 'block'
			})
		).toThrow(`Parent doesnot contain any children at index 3`);
	});

	it(`Should throw an error if the pivot doesnt exist for object position`, () => {
		const parent: IPage = { type: 'page', id: 'parent_id', content: [] } as any;
		expect(() =>
			positionChildren({
				parent,
				child_id: 'child_id',
				position: {
					id: '456',
					position: 'After'
				},
				parent_type: 'block'
			})
		).toThrow(`Parent doesnot contain any children with id 456`);
	});
});
