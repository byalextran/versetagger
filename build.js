const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const isDev = args.includes('--dev');
const isWatch = args.includes('--watch');

const commonOptions = {
  entryPoints: ['src/core/VerseTagger.ts'],
  bundle: true,
  sourcemap: isDev,
  minify: !isDev,
  target: 'es2017',
};

async function build() {
  try {
    // Ensure dist directory exists
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist');
    }

    // Build UMD bundle for browsers/CDN
    await esbuild.build({
      ...commonOptions,
      outfile: 'dist/versetagger.js',
      format: 'iife',
      globalName: 'VerseTagger',
      footer: {
        js: 'if (typeof module !== "undefined" && module.exports) { module.exports = VerseTagger; }'
      }
    });

    // Build ESM bundle for npm/bundlers
    await esbuild.build({
      ...commonOptions,
      outfile: 'dist/versetagger.esm.js',
      format: 'esm',
    });

    console.log('✓ Build completed successfully');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

if (isWatch) {
  const ctx = esbuild.context({
    ...commonOptions,
    outfile: 'dist/versetagger.js',
    format: 'iife',
    globalName: 'VerseTagger',
  }).then(ctx => {
    ctx.watch();
    console.log('👀 Watching for changes...');
  });
} else {
  build();
}
