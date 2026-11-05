// Builds ./www from ./src/index.html so the app works fully offline:
// copies Chart.js, SheetJS and PapaParse from node_modules and rewrites the CDN tags.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const www = path.join(root, 'www');
const vendor = path.join(www, 'vendor');

fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(vendor, { recursive: true });

function copy(rel, name) {
  const from = path.join(root, 'node_modules', rel);
  if (!fs.existsSync(from)) throw new Error(`Missing ${rel}. Run "npm install" first.`);
  fs.copyFileSync(from, path.join(vendor, name));
}
copy('chart.js/dist/chart.umd.js', 'chart.umd.js');
copy('xlsx/dist/xlsx.full.min.js', 'xlsx.full.min.js');
copy('papaparse/papaparse.min.js', 'papaparse.min.js');

let html = fs.readFileSync(path.join(root, 'src', 'index.html'), 'utf8');
html = html
  .replace(/<link[^>]*fonts\.(googleapis|gstatic)\.com[^>]*>\s*/g, '')
  .replace(/<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/chart\.js[^"]*"><\/script>/, '<script src="vendor/chart.umd.js"></script>')
  .replace(/<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/xlsx[^"]*"><\/script>/, '<script src="vendor/xlsx.full.min.js"></script>')
  .replace(/<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/papaparse[^"]*"><\/script>/, '<script src="vendor/papaparse.min.js"></script>');

if (/https:\/\/(cdn|fonts)\./.test(html)) throw new Error('A CDN reference is still in index.html');
fs.writeFileSync(path.join(www, 'index.html'), html);
console.log('www/ ready (offline build).');
