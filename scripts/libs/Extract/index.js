"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NishanScriptsExtract = void 0;
const extractDependencies_1 = require("./extractDependencies");
const extractModuleDependencies_1 = require("./extractModuleDependencies");
const extractPackageDependencies_1 = require("./extractPackageDependencies");
const extractPackageInstalledDependencies_1 = require("./extractPackageInstalledDependencies");
exports.NishanScriptsExtract = {
    dependencies: extractDependencies_1.extractDependencies,
    packageDependencies: extractPackageDependencies_1.extractPackageDependencies,
    moduleDependencies: extractModuleDependencies_1.extractModuleDependencies,
    packageInstalledDependencies: extractPackageInstalledDependencies_1.extractPackageInstalledDependencies
};
//# sourceMappingURL=index.js.map