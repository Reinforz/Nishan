import { NotionUtils } from '@nishans/utils';
import { commonBlockResolvers } from './utils';

export const pageResolver = {
	properties: (parent: any) => ({
		title: NotionUtils.extractInlineBlockContent(parent.properties.title[0][0])
	}),
	...commonBlockResolvers
};
