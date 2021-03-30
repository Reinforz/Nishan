"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOutdatedDeps = void 0;
const __1 = require("../");
const packages_json_1 = __importDefault(require("../../packages.json"));
const updateOutdatedDeps = async () => {
    const outdated_dependency_map = await __1.NishanScripts.Get.outdatedDeps();
    for (const { name } of packages_json_1.default) {
        await __1.NishanScripts.Update.packageDependency(outdated_dependency_map, name);
    }
};
exports.updateOutdatedDeps = updateOutdatedDeps;
//# sourceMappingURL=updateOutdatedDeps.js.map