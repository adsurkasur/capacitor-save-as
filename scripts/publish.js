#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  const pkgPath = path.join(__dirname, '..', 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const version = pkg.version;
  const tagName = `v${version}`;

  console.log(`\n📦 Publishing ${pkg.name}@${version}...\n`);

  // Step 1: Verify git tag exists
  console.log('📋 Verifying release tag...');
  try {
    execSync(`git rev-parse ${tagName}`, { 
      stdio: 'pipe',
      cwd: path.join(__dirname, '..')
    });
    console.log(`   ✓ Tag ${tagName} found\n`);
  } catch (e) {
    console.error(`\n❌ Error: Release tag ${tagName} not found!\n`);
    console.error('Create the tag first:\n');
    console.error('  npm run release\n');
    process.exit(1);
  }

  // Step 2: Build
  console.log('🔨 Building TypeScript...');
  execSync('npm run build', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  console.log('   ✓ Build complete\n');

  // Step 3: Publish
  console.log('🚀 Publishing to npm...');
  execSync('npm publish', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });

  console.log(`\n✅ Package published successfully!\n`);
  console.log(`   Package: ${pkg.name}@${version}`);
  console.log(`   Registry: https://www.npmjs.com/package/${pkg.name}\n`);
  console.log(`📝 View on npm:`);
  console.log(`   https://www.npmjs.com/package/${pkg.name}/v/${version}\n`);

  // Step 4: Push git tag
  console.log('📤 Push the release tag with:');
  console.log(`   git push origin ${tagName}\n`);

} catch (error) {
  console.error(`\n❌ Error: Failed to publish package\n`);
  console.error(error.message);
  console.error('\n💡 If you have 2FA enabled on npm:');
  console.error('   1. Create a granular access token at: https://www.npmjs.com/settings/tokens');
  console.error('   2. Enable "Bypass 2FA when publishing"');
  console.error('   3. Use: npm login (and paste the token as password)\n');
  process.exit(1);
}
