import { ICollection } from '@nishans/types';
import { tsu, txsu } from '../../../../fabricator/tests/utils';

export const tas = {
	property: 'title',
	direction: 'ascending'
};

export const txas = {
	property: 'text',
	direction: 'ascending'
};

export const createCollection = (): ICollection => {
	return {
		id: 'collection_1',
		schema: {
			title: tsu,
			text: txsu
		}
	} as any;
};
