import { updateOutdatedDeps } from './updateOutdatedDeps';
import { updatePackageDependency } from './updatePackageDependency';
import { updatePackageDescription } from './updatePackageDescription';
import { updatePackageMetadata } from './updatePackageMetadata';
import { updatePatchVersion } from './updatePatchVersion';

export const NishanScriptsUpdate = {
	packageDescription: updatePackageDescription,
	packageDependency: updatePackageDependency,
	packageMetadata: updatePackageMetadata,
	patchVersion: updatePatchVersion,
	outdatedDeps: updateOutdatedDeps
};
