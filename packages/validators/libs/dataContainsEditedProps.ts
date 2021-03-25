import { TDataType } from '@nishans/types';
export const dataContainsEditedProps = (data_type: TDataType) => Boolean(data_type.match(/^(block|space|comment)$/));
