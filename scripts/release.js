#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  const pkgPath = path.join(__dirname, '..', 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const version = pkg.version;
  const tagName = `v${version}`;

  console.log(`\n🏷️  Creating release tag...\n`);

  // Check if tag already exists
  try {
    execSync(`git rev-parse ${tagName}`, { 
      stdio: 'pipe',
      cwd: path.join(__dirname, '..')
    });
    console.error(`\n❌ Error: Tag ${tagName} already exists!\n`);
    process.exit(1);
  } catch (e) {
    // Tag doesn't exist, which is what we want
  }

  // Check if there are uncommitted changes
  try {
    const status = execSync('git status --porcelain', { 
      encoding: 'utf8',
      cwd: path.join(__dirname, '..')
    }).trim();

    if (status) {
      console.error(`\n❌ Error: You have uncommitted changes!\n`);
      console.error('Please commit your changes first:\n');
      console.error('  git add .');
      console.error('  git commit -m "Bump version to ' + version + '"\n');
      process.exit(1);
    }
  } catch (e) {
    // Ignore git errors
  }

  // Create annotated tag
  const tagMessage = `Release version ${version}`;
  execSync(`git tag -a ${tagName} -m "${tagMessage}"`, { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });

  console.log(`\n✅ Release tag created successfully!\n`);
  console.log(`   Tag: ${tagName}`);
  console.log(`   Message: ${tagMessage}\n`);
  console.log('📤 Push the tag with:');
  console.log(`   git push origin ${tagName}\n`);
  console.log('💡 Next step: npm run publish\n');

} catch (error) {
  console.error(`\n❌ Error: Failed to create release tag\n`);
  console.error(error.message);
  process.exit(1);
}
