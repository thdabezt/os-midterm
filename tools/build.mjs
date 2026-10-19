import { mkdir, copyFile, cp, rm } from 'node:fs/promises';
const out = new URL('../dist/', import.meta.url);
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
for (const file of ['index.html', 'app.js', 'i18n.js', 'styles.css', 'scheduler.js', 'practice.js', 'favicon.svg']) {
  await copyFile(new URL('../' + file, import.meta.url), new URL(file, out));
}
await cp(new URL('../data/', import.meta.url), new URL('data/', out), { recursive: true });
await copyFile(new URL('../.nojekyll', import.meta.url), new URL('.nojekyll', out));
console.log('Static website built in dist/');
