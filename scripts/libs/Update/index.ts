import { updatePackageJsonDependencies } from './updatePackageJsonDependencies';
import { updatePackageJsonDescription } from './updatePackageJsonDescription';
import { updatePackageMetadata } from './updatePackageMetadata';
import { updatePatchVersion } from './updatePatchVersion';

export const NishanScriptsUpdate = {
	packageJsonDescription: updatePackageJsonDescription,
	PackageJsonDependencies: updatePackageJsonDependencies,
	packageMetadata: updatePackageMetadata,
	patchVersion: updatePatchVersion
};
