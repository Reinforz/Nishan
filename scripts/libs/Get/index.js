"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NishanScriptsGet = void 0;
const getOutdatedDeps_1 = require("./getOutdatedDeps");
const getPackageJsonData_1 = require("./getPackageJsonData");
const getPackageJsonDependencies_1 = require("./getPackageJsonDependencies");
const getPackageNonInstalledDependencies_1 = require("./getPackageNonInstalledDependencies");
const getPackagesNonInstalledDependencies_1 = require("./getPackagesNonInstalledDependencies");
exports.NishanScriptsGet = {
    packageJsonDependencies: getPackageJsonDependencies_1.getPackageJsonDependencies,
    packageNonInstalledDependencies: getPackageNonInstalledDependencies_1.getPackageNonInstalledDependencies,
    packagesNonInstalledDependencies: getPackagesNonInstalledDependencies_1.getPackagesNonInstalledDependencies,
    outdatedDeps: getOutdatedDeps_1.getOutdatedDeps,
    packageJsonData: getPackageJsonData_1.getPackageJsonData
};
//# sourceMappingURL=index.js.map