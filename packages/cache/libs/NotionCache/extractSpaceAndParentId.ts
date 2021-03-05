import { UpdateCacheManuallyParam } from '@nishans/endpoints';
import { TBlock } from '@nishans/types';

export function extractSpaceAndParentId (data: TBlock) {
	const sync_record_values: UpdateCacheManuallyParam = [];
	if (data.parent_table === 'space') sync_record_values.push([ data.parent_id, 'space' ]);
	else {
		sync_record_values.push([ data.parent_id, 'block' ]);
		sync_record_values.push([ data.space_id, 'space' ]);
	}
	return sync_record_values;
}
