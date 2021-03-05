import { commonBlockResolvers } from './utils';

export const pageResolver = {
	properties: (parent: any) => ({
		title: parent.properties.title[0][0]
	}),
	...commonBlockResolvers
};
