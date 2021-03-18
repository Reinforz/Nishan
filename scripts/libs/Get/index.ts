import { getOutdatedDeps } from './getOutdatedDeps';
import { getPackageJsonData } from './getPackageJsonData';
import { getPackageJsonDependencies } from './getPackageJsonDependencies';
import { getPackageNonInstalledDependencies } from './getPackageNonInstalledDependencies';
import { getPackagesNonInstalledDependencies } from './getPackagesNonInstalledDependencies';

export const NishanScriptsGet = {
	packageJsonDependencies: getPackageJsonDependencies,
	packageNonInstalledDependencies: getPackageNonInstalledDependencies,
	packagesNonInstalledDependencies: getPackagesNonInstalledDependencies,
	outdatedDeps: getOutdatedDeps,
	packageJsonData: getPackageJsonData
};
