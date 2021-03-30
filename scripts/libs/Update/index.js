"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NishanScriptsUpdate = void 0;
const updateOutdatedDeps_1 = require("./updateOutdatedDeps");
const updatePackageDependency_1 = require("./updatePackageDependency");
const updatePackageDescription_1 = require("./updatePackageDescription");
const updatePackageMetadata_1 = require("./updatePackageMetadata");
const updatePatchVersion_1 = require("./updatePatchVersion");
exports.NishanScriptsUpdate = {
    packageDescription: updatePackageDescription_1.updatePackageDescription,
    packageDependency: updatePackageDependency_1.updatePackageDependency,
    packageMetadata: updatePackageMetadata_1.updatePackageMetadata,
    patchVersion: updatePatchVersion_1.updatePatchVersion,
    outdatedDeps: updateOutdatedDeps_1.updateOutdatedDeps
};
//# sourceMappingURL=index.js.map