import { getPackageJsonDependencies } from './getPackageJsonDependencies';
import { getPackageNonInstalledDependencies } from './getPackageNonInstalledDependencies';

export const NishanScriptsGet = {
	packageJsonDependencies: getPackageJsonDependencies,
	packageNonInstalledDependencies: getPackageNonInstalledDependencies
};
