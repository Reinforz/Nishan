"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePackageDependency = void 0;
const colors_1 = __importDefault(require("colors"));
const fs_1 = __importDefault(require("fs"));
const __1 = require("../");
async function updatePackageDependency(packages_deps_version_map, package_name) {
    const { package_json_data, package_json_path } = await __1.NishanScripts.Get.packageJsonData(package_name);
    const package_version = packages_deps_version_map.get(package_name);
    if (package_version)
        package_json_data.version = package_version;
    ['dependencies', 'devDependencies'].forEach((dependency_type) => {
        Object.keys(package_json_data[dependency_type] ?? {}).forEach((dependency_name) => {
            const packages_deps_version = packages_deps_version_map.get(dependency_name);
            if (packages_deps_version) {
                package_json_data[dependency_type][dependency_name] = packages_deps_version;
                console.log(colors_1.default.bold.blue(`${dependency_type} ${dependency_name} ${packages_deps_version}`));
            }
        });
    });
    await fs_1.default.promises.writeFile(package_json_path, JSON.stringify(package_json_data, null, 2), 'utf-8');
}
exports.updatePackageDependency = updatePackageDependency;
//# sourceMappingURL=updatePackageDependency.js.map