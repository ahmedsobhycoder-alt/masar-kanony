const fs = require('fs');
const path = require('path');

// Defines source (src/locales) and target (dist/locales) directories
const srcDir = path.join(__dirname, '../src/infrastructure/locales');
const destDir = path.join(__dirname, '../dist/locales');

// Copies translation files to dist folder after compilation
if (fs.existsSync(srcDir)) {
  fs.cpSync(srcDir, destDir, { recursive: true });
  console.log('✅ Locales successfully copied to dist/locales');
} else {
  console.warn('⚠️ Source locales directory not found at:', srcDir);
}