"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackagesNonInstalledDependencies = void 0;
const colors_1 = __importDefault(require("colors"));
const __1 = require("../");
const packages_json_1 = __importDefault(require("../../packages.json"));
const getPackagesNonInstalledDependencies = async () => {
    const package_non_installed_dependencies_map = new Map();
    for (let index = 0; index < packages_json_1.default.length; index++) {
        const package_data = packages_json_1.default[index], package_name = package_data.name.split('/')[1], non_installed_dependencies = await __1.NishanScripts.Get.packageNonInstalledDependencies(package_name);
        package_non_installed_dependencies_map.set(package_name, non_installed_dependencies);
        console.log(colors_1.default.red.bold(JSON.stringify(non_installed_dependencies, null, 2)));
    }
    return package_non_installed_dependencies_map;
};
exports.getPackagesNonInstalledDependencies = getPackagesNonInstalledDependencies;
//# sourceMappingURL=getPackagesNonInstalledDependencies.js.map