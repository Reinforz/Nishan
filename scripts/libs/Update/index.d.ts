import { updatePackageDependency } from './updatePackageDependency';
import { updatePackageDescription } from './updatePackageDescription';
import { updatePackageMetadata } from './updatePackageMetadata';
import { updatePatchVersion } from './updatePatchVersion';
export declare const NishanScriptsUpdate: {
    packageDescription: typeof updatePackageDescription;
    packageDependency: typeof updatePackageDependency;
    packageMetadata: typeof updatePackageMetadata;
    patchVersion: typeof updatePatchVersion;
    outdatedDeps: () => Promise<void>;
};
