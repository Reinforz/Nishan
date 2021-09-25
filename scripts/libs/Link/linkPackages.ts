import cp from 'child_process';
import fs from 'fs';
import path from 'path';

export function linkPackages(startFrom?: string) {
  const root_dir = path.resolve(__dirname, '../../../../packages');
  const packageNames = fs.readdirSync(root_dir);
  const packageIndex = startFrom ? packageNames.indexOf(startFrom) : 0;
  packageNames.slice(packageIndex).forEach((packageName) => {
    const packageDirectory = path.join(root_dir, packageName);
    const packageJsonData = JSON.parse(
      fs.readFileSync(path.join(packageDirectory, 'package.json')).toString()
    );
    const linkedPackages: Set<string> = new Set();
    Object.keys({
      ...(packageJsonData.dependencies ?? {}),
      ...(packageJsonData.devDependencies ?? {})
    })?.forEach((dependency) => {
      if (dependency.startsWith('@nishans')) {
        linkedPackages.add(dependency);
      }
    });

    const linkedPackagesArray = Array.from(linkedPackages);
    if (linkedPackagesArray.length) {
      console.log(linkedPackagesArray);
      cp.execSync(`npm link ${linkedPackagesArray.join(' ')}`, {
        cwd: packageDirectory
      });
      console.log(`Linked @nishans/${packageName}`);
    }
  });
}
