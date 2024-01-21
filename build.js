import json from './lerna.json' assert { type: 'json' };
import fs from 'fs';

function build() {
  console.log(`Building version ${json.version}`);
  fs.writeFileSync('./docs/version', json.version);

  console.log('Copying files');
  fs.copyFileSync('./packages/core/dist/index.html', './docs/index.html');
  fs.copyFileSync('./packages/pwa/dist/index.html', './docs/pwa.html');
}

build();
