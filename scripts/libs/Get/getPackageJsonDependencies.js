"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageJsonDependencies = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getPackageJsonDependencies = async (package_name) => {
    const package_json_path = path_1.default.resolve(__dirname, `../../../../packages/${package_name}/package.json`);
    const package_json_data = JSON.parse(await fs_1.default.promises.readFile(package_json_path, 'utf-8'));
    return { ...(package_json_data.dependencies ?? {}), ...(package_json_data.devDependencies ?? {}) };
};
exports.getPackageJsonDependencies = getPackageJsonDependencies;
//# sourceMappingURL=getPackageJsonDependencies.js.map