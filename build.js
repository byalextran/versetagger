const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const isDev = args.includes('--dev');
const isWatch = args.includes('--watch');

const commonOptions = {
  entryPoints: ['src/index.ts'],
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
    // Uses IIFE format with UMD-style fallback for CommonJS
    await esbuild.build({
      ...commonOptions,
      outfile: 'dist/versetagger.js',
      format: 'iife',
      globalName: 'VerseTagger',
      footer: {
        js: `
// UMD-style export for compatibility
if (typeof module !== "undefined" && module.exports) {
  module.exports = VerseTagger;
  module.exports.default = VerseTagger;
  module.exports.VerseTagger = VerseTagger;
}
if (typeof define === "function" && define.amd) {
  define([], function() { return VerseTagger; });
}
`.trim()
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
  esbuild.context({
    ...commonOptions,
    outfile: 'dist/versetagger.js',
    format: 'iife',
    globalName: 'VerseTagger',
    footer: {
      js: `
// UMD-style export for compatibility
if (typeof module !== "undefined" && module.exports) {
  module.exports = VerseTagger;
  module.exports.default = VerseTagger;
  module.exports.VerseTagger = VerseTagger;
}
if (typeof define === "function" && define.amd) {
  define([], function() { return VerseTagger; });
}
`.trim()
    }
  }).then(ctx => {
    ctx.watch();
    console.log('👀 Watching for changes...');
  });
} else {
  build();
}
