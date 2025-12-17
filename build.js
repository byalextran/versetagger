const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

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

/**
 * Analyze bundle size and display statistics
 */
function analyzeBundleSize(filePath, label) {
  const stats = fs.statSync(filePath);
  const sizeInBytes = stats.size;
  const sizeInKB = (sizeInBytes / 1024).toFixed(2);

  // Calculate gzipped size
  const content = fs.readFileSync(filePath);
  const gzipped = zlib.gzipSync(content);
  const gzippedSizeInBytes = gzipped.length;
  const gzippedSizeInKB = (gzippedSizeInBytes / 1024).toFixed(2);

  console.log(`\n📦 ${label}:`);
  console.log(`   Raw:     ${sizeInKB} KB (${sizeInBytes.toLocaleString()} bytes)`);
  console.log(`   Gzipped: ${gzippedSizeInKB} KB (${gzippedSizeInBytes.toLocaleString()} bytes)`);

  // Warn if bundle is getting too large (target is <30KB gzipped)
  if (gzippedSizeInKB > 30) {
    console.log(`   ⚠️  Warning: Gzipped size exceeds 30KB target!`);
  }

  return { raw: sizeInBytes, gzipped: gzippedSizeInBytes };
}

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

    console.log('\n✓ Build completed successfully');

    // Analyze bundle sizes (only in production builds)
    if (!isDev) {
      console.log('\n📊 Bundle Size Analysis:');
      console.log('─'.repeat(50));
      const umdStats = analyzeBundleSize('dist/versetagger.js', 'UMD Bundle (Browser/CDN)');
      const esmStats = analyzeBundleSize('dist/versetagger.esm.js', 'ESM Bundle (npm/bundlers)');

      console.log('\n' + '─'.repeat(50));
      console.log(`📈 Total (UMD + ESM):`);
      console.log(`   Raw:     ${((umdStats.raw + esmStats.raw) / 1024).toFixed(2)} KB`);
      console.log(`   Gzipped: ${((umdStats.gzipped + esmStats.gzipped) / 1024).toFixed(2)} KB`);
      console.log('─'.repeat(50) + '\n');
    }
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
