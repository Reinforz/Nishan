import { IPage } from '@nishans/types';
import deepEqual from 'deep-equal';
import { positionChildren } from '../../src';
import data from '../data';

describe('positionChildren', () => {
	it(`Should work when parent doesnot contain container`, () => {
		const parent = JSON.parse(
			JSON.stringify(data.recordMap.block['6eae77bf-64cd-4ed0-adfb-e97d928a6402'].value)
		) as IPage;
		delete (parent as any).content;
		const operation = positionChildren({
			parent,
			child_id: '123',
			position: 0,
			parent_type: 'block'
		});

		expect(parent.content[0]).toBe('123');

		expect(
			deepEqual(operation, {
				path: [ 'content' ],
				table: 'block',
				command: 'listAfter',
				args: {
					after: '',
					id: '123'
				},
				id: '6eae77bf-64cd-4ed0-adfb-e97d928a6402'
			})
		).toBe(true);
	});

	it(`Should work when position is a number`, () => {
		const parent = JSON.parse(
			JSON.stringify(data.recordMap.block['6eae77bf-64cd-4ed0-adfb-e97d928a6402'].value)
		) as IPage;
		const operation = positionChildren({
			parent,
			child_id: '123',
			position: 0,
			parent_type: 'block'
		});

		expect(parent.content[0]).toBe('123');
		expect(
			deepEqual(operation, {
				path: [ 'content' ],
				table: 'block',
				command: 'listBefore',
				args: {
					before: '6eae77bf-64cd-4ed0-adfb-e97d928a6401',
					id: '123'
				},
				id: '6eae77bf-64cd-4ed0-adfb-e97d928a6402'
			})
		).toBe(true);
	});

	it(`Should push to last if position not provided`, () => {
		const parent = JSON.parse(
			JSON.stringify(data.recordMap.block['6eae77bf-64cd-4ed0-adfb-e97d928a6402'].value)
		) as IPage;
		const operation = positionChildren({
			parent,
			child_id: '123',
			parent_type: 'block'
		});

		expect(parent.content.pop()).toBe('123');
		expect(
			deepEqual(operation, {
				path: [ 'content' ],
				table: 'block',
				command: 'listAfter',
				args: {
					after: '',
					id: '123'
				},
				id: '6eae77bf-64cd-4ed0-adfb-e97d928a6402'
			})
		).toBe(true);
	});

	it(`Should work when position is an object(position: After)`, () => {
		const parent = JSON.parse(
			JSON.stringify(data.recordMap.block['6eae77bf-64cd-4ed0-adfb-e97d928a6402'].value)
		) as IPage;
		const operation = positionChildren({
			logger: () => {
				return;
			},
			position: {
				id: '6eae77bf-64cd-4ed0-adfb-e97d928a6401',
				position: 'After'
			},
			parent,
			child_id: '123',
			parent_type: 'block'
		});

		expect(parent.content[1]).toBe('123');
		expect(
			deepEqual(operation, {
				path: [ 'content' ],
				table: 'block',
				command: 'listAfter',
				args: {
					after: '6eae77bf-64cd-4ed0-adfb-e97d928a6401',
					id: '123'
				},
				id: '6eae77bf-64cd-4ed0-adfb-e97d928a6402'
			})
		).toBe(true);
	});

	it(`Should work when position is an object(position: Before)`, () => {
		const parent = JSON.parse(
			JSON.stringify(data.recordMap.block['6eae77bf-64cd-4ed0-adfb-e97d928a6402'].value)
		) as IPage;
		const operation = positionChildren({
			position: {
				id: '6eae77bf-64cd-4ed0-adfb-e97d928a6401',
				position: 'Before'
			},
			parent,
			child_id: '123',
			parent_type: 'block'
		});

		expect(parent.content[0]).toBe('123');
		expect(
			deepEqual(operation, {
				path: [ 'content' ],
				table: 'block',
				command: 'listBefore',
				args: {
					before: '6eae77bf-64cd-4ed0-adfb-e97d928a6401',
					id: '123'
				},
				id: '6eae77bf-64cd-4ed0-adfb-e97d928a6402'
			})
		).toBe(true);
	});

	it(`Should throw an error if the pivot and content doesnt exist for number position`, () => {
		const parent = JSON.parse(
			JSON.stringify(data.recordMap.block['6eae77bf-64cd-4ed0-adfb-e97d928a6402'].value)
		) as IPage;
		delete (parent as any).content;
		expect(() =>
			positionChildren({
				parent,
				child_id: '123',
				position: 3,
				parent_type: 'block'
			})
		).toThrow(`Parent doesnot contain any children at index 3`);
	});

	it(`Should throw an error if the pivot doesnt exist for number position`, () => {
		const parent = JSON.parse(
			JSON.stringify(data.recordMap.block['6eae77bf-64cd-4ed0-adfb-e97d928a6402'].value)
		) as IPage;
		expect(() =>
			positionChildren({
				parent,
				child_id: '123',
				position: 3,
				parent_type: 'block'
			})
		).toThrow(`Parent doesnot contain any children at index 3`);
	});

	it(`Should throw an error if the pivot doesnt exist for object position`, () => {
		const parent = JSON.parse(
			JSON.stringify(data.recordMap.block['6eae77bf-64cd-4ed0-adfb-e97d928a6402'].value)
		) as IPage;
		expect(() =>
			positionChildren({
				parent,
				child_id: '123',
				position: {
					id: '456',
					position: 'After'
				},
				parent_type: 'block'
			})
		).toThrow(`Parent doesnot contain any children with id 456`);
	});
});
