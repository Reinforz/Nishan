import { NotionQueries, NotionRequestConfigs } from '@nishans/endpoints';
import { TDataType } from '@nishans/types';

export async function fetchNotionData (id: string, table: TDataType, request_configs: NotionRequestConfigs) {
	const { recordMap } = await NotionQueries.syncRecordValues(
		{
			requests: [
				{
					id,
					table: table,
					version: 0
				}
			]
		},
		{
			interval: 0,
			...request_configs
		}
	);
	return recordMap[table][id].value;
}
