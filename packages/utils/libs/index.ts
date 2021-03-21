export * from './types';

import { createDefaultRecordMap } from './createDefaultRecordMap';
import { deepMerge } from './deepMerge';
import { extractInlineBlockContent } from './extractInlineBlockContent';
import { generateSchemaMap } from './generateSchemaMap';
import { getSchemaMapUnit } from './getSchemaMapUnit';
import { getSchemaUnit } from './getSchemaUnit';
import { setDefault } from './setDefault';
import { updateLastEditedProps } from './updateLastEditedProps';

export const NotionUtils = {
	getSchemaMapUnit,
	deepMerge,
	getSchemaUnit,
	setDefault,
	generateSchemaMap,
	extractInlineBlockContent,
	createDefaultRecordMap,
	updateLastEditedProps
};
