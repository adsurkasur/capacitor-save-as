# Release Workflow Scripts

Automated npm scripts for managing version bumps, releases, and publishing.

## Available Scripts

### 1. Bump Version

Automatically bumps the version in both `package.json` and `android/build.gradle`.

```bash
# Bump patch version (0.2.0 → 0.2.1)
npm run bump:patch

# Bump minor version (0.2.0 → 0.3.0)
npm run bump:minor

# Bump major version (0.2.0 → 1.0.0)
npm run bump:major

# Or specify the type manually
npm run bump patch
npm run bump minor
npm run bump major
```

**What it does:**
- Updates version in `package.json`
- Updates `versionName` in `android/build.gradle`
- Does NOT commit changes (you do that manually)

### 2. Release

Creates a git tag for the release.

```bash
npm run release
```

**What it does:**
- Checks that you have committed all changes
- Creates an annotated git tag (e.g., `v0.2.0`)
- Verifies the tag was created successfully

**Requirements:**
- All changes must be committed to git first
- The tag must not already exist

### 3. Publish

Builds the TypeScript and publishes to npm.

```bash
npm run publish
```

**What it does:**
- Verifies the release git tag exists
- Builds TypeScript to `dist/`
- Publishes to npm registry
- Shows the npm package URL

**Requirements:**
- Must be logged into npm (`npm login`)
- Release tag must exist (`npm run release` first)
- If you have 2FA enabled, use a granular access token (see below)

---

## Complete Release Workflow

Follow these steps to release a new version:

### Step 1: Bump the version
```bash
npm run bump:minor
```

### Step 2: Commit the version bump
```bash
git add package.json android/build.gradle
git commit -m "Bump version to X.Y.Z"
```

### Step 3: Create a release tag
```bash
npm run release
```

### Step 4: Publish to npm
```bash
npm run publish
```

### Step 5: Push the git tag (optional, but recommended)
```bash
git push origin vX.Y.Z
```

---

## 2FA Setup for npm Publishing

If you have two-factor authentication enabled on npm:

1. Go to: https://www.npmjs.com/settings/tokens
2. Click **"Generate New Token"** → **"Granular Access Token"**
3. Configure:
   - **Permissions**: Select "Publish"
   - **Bypass 2FA**: Enable ✅
4. Click **"Generate Token"**
5. Copy the token
6. Run: `npm login`
   - Username: Your npm username
   - Password: Paste the token from step 5
   - Email: Your npm email

---

## Troubleshooting

### ❌ Error: "Tag already exists"
Delete the tag and try again:
```bash
git tag -d vX.Y.Z
npm run release
```

### ❌ Error: "You have uncommitted changes"
Commit or discard your changes:
```bash
git add .
git commit -m "Your message"
npm run release
```

### ❌ Error: "Not found" or "403 Forbidden"
You're not authenticated. Run:
```bash
npm logout
npm login
```
Then try publishing again.

### ❌ Error: "Two-factor authentication required"
Create a granular access token (see 2FA Setup above).

---

## Script Details

- **bump-version.js** - Updates version numbers in both files
- **release.js** - Creates git release tags
- **publish.js** - Builds and publishes to npm
