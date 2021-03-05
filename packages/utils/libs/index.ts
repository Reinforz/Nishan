export * from './types';

import { deepMerge } from './deepMerge';
import { extractInlineBlockContent } from './extractInlineBlockContent';
import { getSchemaMapUnit } from './getSchemaMapUnit';
import { getSchemaUnit } from './getSchemaUnit';
import { setDefault } from './setDefault';

export const NotionUtils = {
	getSchemaMapUnit,
	deepMerge,
	getSchemaUnit,
	setDefault,
	extractInlineBlockContent
};
