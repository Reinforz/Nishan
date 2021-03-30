"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageNonInstalledDependencies = void 0;
const __1 = require("../");
const getPackageNonInstalledDependencies = async (package_name) => {
    const package_imported_dependency_map = await __1.NishanScripts.Extract.packageInstalledDependencies(package_name);
    const package_json_dependencies = await __1.NishanScripts.Get.packageJsonDependencies(package_name);
    const package_non_installed_dependency_map = new Map();
    for (const [package_imported_dependency, module_names] of package_imported_dependency_map) {
        const package_imported_dependency_path = package_imported_dependency.split('/');
        let updated_package_imported_dependency = package_imported_dependency;
        if (package_imported_dependency_path.length >= 2)
            updated_package_imported_dependency = `${package_imported_dependency_path[0]}/${package_imported_dependency_path[1]}`;
        if (!updated_package_imported_dependency.match(/(fs|path|child_process)/) &&
            !package_json_dependencies[updated_package_imported_dependency])
            package_non_installed_dependency_map.set(updated_package_imported_dependency, module_names);
    }
    return package_non_installed_dependency_map;
};
exports.getPackageNonInstalledDependencies = getPackageNonInstalledDependencies;
//# sourceMappingURL=getPackageNonInstalledDependencies.js.map