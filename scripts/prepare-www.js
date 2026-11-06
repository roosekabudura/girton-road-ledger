// Builds ./www from ./src so the app works offline and can be hosted or wrapped as an APK:
// copies the libraries from node_modules and rewrites the CDN script tags.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const www = path.join(root, 'www');
const vendor = path.join(www, 'vendor');
const src = path.join(root, 'src');

fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(vendor, { recursive: true });

function copyLib(rel, name, required) {
  const from = path.join(root, 'node_modules', rel);
  if (!fs.existsSync(from)) {
    if (required) throw new Error(`Missing ${rel}. Run "npm install" first.`);
    console.warn(`Note: ${rel} not found, keeping the online copy for ${name}.`);
    return false;
  }
  fs.copyFileSync(from, path.join(vendor, name));
  return true;
}

copyLib('chart.js/dist/chart.umd.js', 'chart.umd.js', true);
copyLib('xlsx/dist/xlsx.full.min.js', 'xlsx.full.min.js', true);
copyLib('papaparse/papaparse.min.js', 'papaparse.min.js', true);

let html = fs.readFileSync(path.join(src, 'index.html'), 'utf8');
html = html
  .replace(/<link[^>]*fonts\.(googleapis|gstatic)\.com[^>]*>\s*/g, '')
  .replace(/<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/chart\.js[^"]*"><\/script>/, '<script src="vendor/chart.umd.js"></script>')
  .replace(/<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/xlsx[^"]*"><\/script>/, '<script src="vendor/xlsx.full.min.js"></script>')
  .replace(/<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/papaparse[^"]*"><\/script>/, '<script src="vendor/papaparse.min.js"></script>');

// Supabase client. If the local copy is missing, the online tag stays in place.
if (copyLib('@supabase/supabase-js/dist/umd/supabase.js', 'supabase.js', false)) {
  html = html.replace(/<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase[^"]*"><\/script>/, '<script src="vendor/supabase.js"></script>');
}

if (/https:\/\/(cdn|fonts)\./.test(html)) throw new Error('A CDN reference is still in index.html');
fs.writeFileSync(path.join(www, 'index.html'), html);

['supabase-config.js', 'sw.js', 'manifest.webmanifest'].forEach((f) => fs.copyFileSync(path.join(src, f), path.join(www, f)));
fs.cpSync(path.join(src, 'icons'), path.join(www, 'icons'), { recursive: true });
console.log('www/ ready.');
