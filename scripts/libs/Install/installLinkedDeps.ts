import cp from 'child_process';
import fs from 'fs';
import path from 'path';

export async function installLinkedDeps() {
  const root_dir = path.resolve(__dirname, '../../../../packages');
  const packageNames = fs.readdirSync(root_dir);
  packageNames.forEach((packageName) => {
    const packageDirectory = path.join(root_dir, packageName);
    cp.execSync('npm install -g .', { cwd: packageDirectory });
    console.log(`Globally installed @nishans/${packageName}`);
  });
}
