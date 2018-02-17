const {spawnSync, spawn} = require('child_process');

const {stdout: diffTreeOutput} = spawnSync('git', ['diff-tree', 'ORIG_HEAD', 'HEAD', 'package.json']);
console.log("diff-tree output:", diffTreeOutput.toString());
const diffTree = diffTreeOutput.toString().split(' ');

const sourceVersion = diffTree[2];
const currentVersion = diffTree[3];

if (!sourceVersion || !currentVersion || sourceVersion === currentVersion) {
  console.log('No changes to dependencies detected');
  process.exit(0);
}

console.log("Source version:", sourceVersion);
console.log("Current version:", currentVersion);

let {stdout: source} = spawnSync('git', ['show', sourceVersion, 'package.json']);
let {stdout: current} = spawnSync('git', ['show', currentVersion, 'package.json']);
source = JSON.parse(source);
current = JSON.parse(current);

const sourceDeps = Object.keys(source.dependencies);
const currentDeps = Object.keys(current.dependencies);
const sourceDevDeps = Object.keys(source.devDependencies);
const currentDevDeps = Object.keys(current.devDependencies);
console.log(`Source has ${sourceDeps.length} dependencies, ${sourceDevDeps.length} dev dependencies`);
console.log(`Current has ${currentDeps.length} dependencies, ${sourceDevDeps.length} dev dependencies`);

if (sourceDeps.length !== currentDeps.length || sourceDevDeps.length !== currentDevDeps.length ||
  sourceDeps.find(d => source.dependencies[d] !== current.dependencies[d]) ||
  sourceDevDeps.find(d => source.devDependencies[d] !== current.devDependencies[d])) {

  console.log('Found differences in dependencies. Running npm update');

  const update = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['update'], {stdio: 'inherit'});
  update.on('close', (code) => {
    console.log(`npm update existed with code ${code}`);
    process.exit(code);
  });
} else {
  console.log('No changes to dependencies detected');
}
