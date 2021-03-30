"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPackageInstalledDependencies = void 0;
const colors_1 = __importDefault(require("colors"));
const extractPackageDependencies_1 = require("./extractPackageDependencies");
const extractPackageInstalledDependencies = async (package_name) => {
    console.log(colors_1.default.blue.bold(`Extracting package dependencies for ${package_name}`));
    const imported_package_dependencies_map = await extractPackageDependencies_1.extractPackageDependencies(package_name);
    const nishans_dependencies_map = new Map();
    for (const [imported_module_dependency, module_names] of imported_package_dependencies_map) {
        if (!imported_module_dependency.startsWith('.'))
            nishans_dependencies_map.set(imported_module_dependency, module_names);
    }
    return nishans_dependencies_map;
};
exports.extractPackageInstalledDependencies = extractPackageInstalledDependencies;
//# sourceMappingURL=extractPackageInstalledDependencies.js.map