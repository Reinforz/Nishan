import { ICollectionBlockInput } from '@nishans/fabricator';

export interface ITableInfo {
  name: string;
  schema: ICollectionBlockInput['schema'];
}
