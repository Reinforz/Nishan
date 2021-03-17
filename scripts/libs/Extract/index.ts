import { extractDependencies } from './extractDependencies';
import { extractModuleDependencies } from './extractModuleDependencies';
import { extractPackageDependencies } from './extractPackageDependencies';
import { extractPackageInstalledDependencies } from './extractPackageInstalledDependencies';

export const NishanScriptsExtract = {
	dependencies: extractDependencies,
	packageDependencies: extractPackageDependencies,
	moduleDependencies: extractModuleDependencies,
	packageInstalledDependencies: extractPackageInstalledDependencies
};
