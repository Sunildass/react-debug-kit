const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const srcDir = 'src';
const distDir = 'dist';

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));

files.forEach(file => {
  const input = path.join(srcDir, file);
  const output = path.join(distDir, file.replace(/\.tsx?$/, '.js'));
  console.log(`Transpiling ${file}...`);
  try {
    execSync(`npx esbuild ${input} --format=esm --loader:${file.endsWith('tsx') ? 'tsx' : 'ts'} --outfile=${output} --jsx=automatic`);
  } catch (e) {
    console.error(`Failed to transpile ${file}: ${e.message}`);
  }
});
