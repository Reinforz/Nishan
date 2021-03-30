"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishUpdatedPackages = void 0;
const colors_1 = __importDefault(require("colors"));
const buildAfterTest_1 = require("../Build/buildAfterTest");
const createDependencyMap_1 = require("../Create/createDependencyMap");
const createPackageMap_1 = require("../Create/createPackageMap");
const createPackagePublishOrder_1 = require("../Create/createPackagePublishOrder");
const updatePatchVersion_1 = require("../Update/updatePatchVersion");
const publishPackages_1 = require("./publishPackages");
async function publishUpdatedPackages(updated_packages_name, resume) {
    const packages_map = await createPackageMap_1.createPackageMap(), package_dependency_map = createDependencyMap_1.createDependencyMap(updated_packages_name, packages_map), rearranged_packages = createPackagePublishOrder_1.createPackagePublishOrder(Array.from(package_dependency_map.all.keys()), packages_map);
    console.log(colors_1.default.blue.bold(rearranged_packages.join('\n')));
    const updated_packages_map = updatePatchVersion_1.updatePatchVersion(rearranged_packages, packages_map, 1);
    await buildAfterTest_1.buildAfterTest(rearranged_packages, resume);
    await publishPackages_1.publishPackages(updated_packages_map);
}
exports.publishUpdatedPackages = publishUpdatedPackages;
//# sourceMappingURL=publishUpdatedPackages.js.map