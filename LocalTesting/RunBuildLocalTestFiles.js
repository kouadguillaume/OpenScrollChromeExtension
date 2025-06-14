const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// Promisify fs methods
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);
const copyFile = promisify(fs.copyFile);

// Configuration
const SOURCE_DIR = path.join(__dirname, '..');
const DEST_DIR = path.join(__dirname, '..', 'LocalTestExtension');

// Files and directories to copy
const FILES_TO_COPY = [
  'images',
  'popup',
  'scrapers',
  'background.js',
  'content.js',
  'manifest.json'
];

async function copyRecursive(src, dest) {
  const stats = await stat(src);
  const isDirectory = stats.isDirectory();

  if (isDirectory) {
    // Create destination directory if it doesn't exist
    try {
      await mkdir(dest, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }

    // Read the directory contents
    const entries = await readdir(src);
    
    // Copy each item in the directory
    for (const entry of entries) {
      const srcPath = path.join(src, entry);
      const destPath = path.join(dest, entry);
      await copyRecursive(srcPath, destPath);
    }
  } else {
    // Ensure the destination directory exists
    const destDir = path.dirname(dest);
    try {
      await mkdir(destDir, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }
    
    // Copy the file
    await copyFile(src, dest);
  }
}

async function cleanAndCreateDir(dir) {
  try {
    // Remove directory if it exists
    if (fs.existsSync(dir)) {
      // Remove directory recursively using fs.rm (built into Node.js)
      await fs.promises.rm(dir, { recursive: true, force: true });
    }
    
    // Create fresh directory
    await mkdir(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  } catch (error) {
    console.error(`❌ Error cleaning/creating directory ${dir}:`, error);
    process.exit(1);
  }
}

async function copyFiles() {
  try {
    console.log('🚀 Starting build process...');
    
    // Create fresh destination directory
    await cleanAndCreateDir(DEST_DIR);
    
    // Copy each file/directory
    for (const item of FILES_TO_COPY) {
      const sourcePath = path.join(SOURCE_DIR, item);
      const destPath = path.join(DEST_DIR, item);
      
      try {
        await copyRecursive(sourcePath, destPath);
        console.log(`✅ Copied: ${item}`);
      } catch (error) {
        console.error(`❌ Error copying ${item}:`, error.message);
        // Continue with other files even if one fails
      }
    }
    
    console.log('\n✨ Build completed successfully!');
    console.log(`📁 Extension ready in: ${DEST_DIR}`);
    console.log('\nYou can now load this directory as an unpacked extension in Chrome.');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Run the build
copyFiles();