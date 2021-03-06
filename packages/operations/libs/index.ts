import { applyPluginsToOperationsStack } from './applyPluginsToOperationsStack';
import { NotionOperationsChunk } from './Chunk';
import { executeOperations } from './executeOperations';
import { NotionOperationsPlugin } from './Plugins';

export * from './types';

export const NotionOperations = {
	executeOperations,
	applyPluginsToOperationsStack,
	Plugin: NotionOperationsPlugin,
	Chunk: NotionOperationsChunk
};
