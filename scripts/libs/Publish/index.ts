import { publishAfterBuild } from './publishAfterBuild';
import { publishUpdatedPackages } from './publishUpdatedPackages';

export const NishanScriptsPublish = {
	afterBuild: publishAfterBuild,
	updatedPackages: publishUpdatedPackages
};
