import { updatePackageJsonDependency } from './updatePackageJsonDependency';
import { updatePackageJsonDescription } from './updatePackageJsonDescription';
import { updatePackageMetadata } from './updatePackageMetadata';
import { updatePatchVersion } from './updatePatchVersion';

export const NishanScriptsUpdate = {
	packageJsonDescription: updatePackageJsonDescription,
	packageJsonDependency: updatePackageJsonDependency,
	packageMetadata: updatePackageMetadata,
	patchVersion: updatePatchVersion
};
