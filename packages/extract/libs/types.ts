import { ICollection, IPage, TView } from '@nishans/types';

export type CollectionExtracted = Pick<ICollection, 'name' | 'description' | 'icon' | 'cover' | 'schema'>;
export type TViewExtracted = Pick<TView, 'type' | 'name' | 'query2' | 'format'>;
export type PageExtracted = Pick<IPage, 'format' | 'properties'>;
