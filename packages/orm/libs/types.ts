import { ICollectionBlockInput } from '@nishans/fabricator';
import { TTextFormat } from '@nishans/types';

export interface ITableInfo {
  name: TTextFormat;
  schema: ICollectionBlockInput['schema'];
}
