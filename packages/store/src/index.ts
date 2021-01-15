import axios from 'axios';
import { SyncRecordValuesResult } from '@nishans/types';
import fs from 'fs';

const idToUuid = (id = '') => {
	id = id.replace(/\-/g, '');
	return `${id.substr(0, 8)}-${id.substr(8, 4)}-${id.substr(12, 4)}-${id.substr(16, 4)}-${id.substr(20)}`;
};

export async function storeLocally (token: string, database_id: string, path: string) {
	const headers = {
		headers: {
			cookie: `token_v2=${token};`
		}
	};
	const { data } = await axios.post<SyncRecordValuesResult>(
		'https://www.notion.so/api/v3/syncRecordValues',
		{
			requests: [
				{
					id: idToUuid(database_id),
					table: 'block',
					version: 0
				}
			]
		},
		headers
	);

	await fs.promises.writeFile(path, JSON.stringify(data, null, 2), 'utf-8');
	/* try {
		const { data } = await axios.post<GetSpacesResult>(
			'https://www.notion.so/api/v3/getSpaces',
			{},
			{
				headers: {
					cookie: `token_v2=${token}`
				}
			}
		);
		console.log(data);
	} catch (err) {
		throw new Error(err.response.data);
	} */
}
