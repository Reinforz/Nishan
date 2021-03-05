import { UpdateCacheManuallyParam } from '@nishans/endpoints';
import { NotionEndpoints } from '@nishans/types';

export function constructSyncRecordsParams (args: UpdateCacheManuallyParam) {
	const sync_record_values: NotionEndpoints['syncRecordValues']['payload']['requests'][0][] = [];
	// Iterate through the passed array argument and construct sync_record argument
	args.forEach((arg) => {
		sync_record_values.push({ id: arg[0], table: arg[1], version: 0 });
	});
	return sync_record_values;
}
