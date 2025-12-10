#!/usr/bin/env node

/**
 * Migration helper script to replace Vuex imports with Pinia
 * This is a helper - manual review is still needed for store.dispatch/store.commit calls
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const replacements = [
  {
    // Replace useStore import
    pattern: /import\s+{\s*useStore\s*}\s+from\s+['"]vuex['"];?/g,
    replacement: `// TODO: Replace with Pinia stores
// import { useStore } from 'vuex';`,
  },
  {
    // Replace store = useStore()
    pattern: /const\s+store\s*=\s*useStore\(\);?/g,
    replacement: `// TODO: Replace with Pinia stores
// const store = useStore();`,
  },
];

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  replacements.forEach(({ pattern, replacement }) => {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Migrated: ${filePath}`);
    return true;
  }
  return false;
}

// Find all Vue files
const files = glob.sync('src/**/*.vue', { cwd: __dirname });

console.log(`Found ${files.length} Vue files`);
let migrated = 0;

files.forEach((file) => {
  const fullPath = path.join(__dirname, file);
  if (migrateFile(fullPath)) {
    migrated++;
  }
});

console.log(`\nMigrated ${migrated} files`);
console.log('\n⚠️  IMPORTANT: This script only comments out Vuex imports.');
console.log('You need to manually replace store usage with Pinia stores!');

