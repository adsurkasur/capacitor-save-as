#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get the version bump type from CLI argument
const bumpType = process.argv[2] || 'patch'; // patch, minor, major

if (!['patch', 'minor', 'major'].includes(bumpType)) {
  console.error('❌ Error: Invalid bump type. Use: patch, minor, or major');
  process.exit(1);
}

try {
  console.log(`\n📦 Bumping version (${bumpType})...\n`);

  // Get current version before bump
  const pkgPath = path.join(__dirname, '..', 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const oldVersion = pkg.version;

  // Use npm version to bump package.json
  execSync(`npm version ${bumpType} --no-git-tag-version`, { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });

  // Read new version
  const newPkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const newVersion = newPkg.version;

  // Update android/build.gradle
  const gradlePath = path.join(__dirname, '..', 'android', 'build.gradle');
  let gradleContent = fs.readFileSync(gradlePath, 'utf8');
  
  const versionRegex = new RegExp(`versionName "${oldVersion}"`, 'g');
  if (!versionRegex.test(gradleContent)) {
    console.error(`❌ Error: Could not find versionName "${oldVersion}" in build.gradle`);
    process.exit(1);
  }

  gradleContent = gradleContent.replace(versionRegex, `versionName "${newVersion}"`);
  fs.writeFileSync(gradlePath, gradleContent, 'utf8');

  console.log(`\n✅ Version bumped successfully!\n`);
  console.log(`   ${oldVersion} → ${newVersion}\n`);
  console.log('Updated files:');
  console.log(`   ✓ package.json`);
  console.log(`   ✓ android/build.gradle`);
  console.log(`\n💡 Next step: npm run release\n`);

} catch (error) {
  console.error(`\n❌ Error: Failed to bump version\n`);
  console.error(error.message);
  process.exit(1);
}
