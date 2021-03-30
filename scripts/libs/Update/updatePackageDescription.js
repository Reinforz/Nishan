"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePackageDescription = void 0;
const fs_1 = __importDefault(require("fs"));
async function updatePackageDescription(package_json_path, description) {
    const package_json_data = JSON.parse(await fs_1.default.promises.readFile(package_json_path, 'utf-8'));
    if (package_json_data.description !== description) {
        package_json_data.description = description;
        await fs_1.default.promises.writeFile(package_json_path, JSON.stringify(package_json_data, null, 2), 'utf-8');
    }
}
exports.updatePackageDescription = updatePackageDescription;
//# sourceMappingURL=updatePackageDescription.js.map