import axios from 'axios';
import { ISpace, LoadUserContentResult } from '@nishans/types';
import { NotionOperationData } from '../src';

export async function getNotionData (token: string, getSpace?: (space: ISpace) => any) {
	const headers = {
		headers: {
			cookie: `token_v2=${token};`,
			['x-notion-active-user-header']: ''
		}
	};

	const { data: { recordMap } } = await axios.post<LoadUserContentResult>(
		'https://www.notion.so/api/v3/loadUserContent',
		{},
		headers
	);
	const user_id = Object.keys(recordMap.notion_user)[0];
	headers.headers['x-notion-active-user-header'] = user_id;

	const space = Object.values(recordMap.space).find(({ value }) => (getSpace ? getSpace(value) : true));
	if (space) {
		const { id: space_id, shard_id } = space.value;
		return {
			space_id,
			shard_id,
			user_id,
			headers
		} as NotionOperationData;
	} else throw new Error('The callback didnot return any space');
}
