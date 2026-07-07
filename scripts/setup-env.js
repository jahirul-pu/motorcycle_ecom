const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const envExamplePath = path.join(rootDir, '.env.example');
const envPath = path.join(rootDir, '.env');

if (!fs.existsSync(envExamplePath)) {
  console.error('.env.example file does not exist in root directory.');
  process.exit(1);
}

if (!fs.existsSync(envPath)) {
  try {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('Successfully created .env file by copying .env.example');
  } catch (error) {
    console.error('Error copying .env.example to .env:', error);
    process.exit(1);
  }
} else {
  console.log('.env file already exists. Skipping copy.');
}
