const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Check if canvas is installed
try {
  require.resolve('canvas');
} catch (e) {
  console.log('Canvas module not found. Installing...');
  const { execSync } = require('child_process');
  execSync('npm install canvas', { stdio: 'inherit' });
}

function createGardenIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#66bb6a');
  gradient.addColorStop(1, '#4caf50');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Draw soil at bottom
  ctx.fillStyle = '#8d6e63';
  ctx.fillRect(0, size * 0.7, size, size * 0.3);

  // Draw sun
  ctx.fillStyle = '#ffd54f';
  ctx.beginPath();
  ctx.arc(size * 0.15, size * 0.15, size * 0.08, 0, Math.PI * 2);
  ctx.fill();

  // Sun rays
  ctx.strokeStyle = '#ffd54f';
  ctx.lineWidth = size * 0.015;
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const x1 = size * 0.15 + Math.cos(angle) * size * 0.11;
    const y1 = size * 0.15 + Math.sin(angle) * size * 0.11;
    const x2 = size * 0.15 + Math.cos(angle) * size * 0.15;
    const y2 = size * 0.15 + Math.sin(angle) * size * 0.15;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // Draw center flower
  const flowerX = size * 0.5;
  const flowerY = size * 0.5;

  // Stem
  ctx.strokeStyle = '#2e7d32';
  ctx.lineWidth = size * 0.02;
  ctx.beginPath();
  ctx.moveTo(flowerX, flowerY);
  ctx.lineTo(flowerX, size * 0.75);
  ctx.stroke();

  // Petals
  ctx.fillStyle = '#ee5a6f';
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI * 2) / 6;
    const petalX = flowerX + Math.cos(angle) * size * 0.08;
    const petalY = flowerY + Math.sin(angle) * size * 0.08;
    ctx.beginPath();
    ctx.arc(petalX, petalY, size * 0.05, 0, Math.PI * 2);
    ctx.fill();
  }

  // Flower center
  ctx.fillStyle = '#fff200';
  ctx.beginPath();
  ctx.arc(flowerX, flowerY, size * 0.04, 0, Math.PI * 2);
  ctx.fill();

  // Left plant
  const plant1X = size * 0.25;
  const plant1Y = size * 0.55;

  // Stem
  ctx.strokeStyle = '#2e7d32';
  ctx.beginPath();
  ctx.moveTo(plant1X, plant1Y);
  ctx.lineTo(plant1X, size * 0.75);
  ctx.stroke();

  // Small flower petals
  ctx.fillStyle = '#ff6b9d';
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
    const petalX = plant1X + Math.cos(angle) * size * 0.06;
    const petalY = plant1Y + Math.sin(angle) * size * 0.06;
    ctx.beginPath();
    ctx.arc(petalX, petalY, size * 0.04, 0, Math.PI * 2);
    ctx.fill();
  }

  // Right plant (leaves)
  const plant3X = size * 0.75;
  const plant3Y = size * 0.6;

  // Stem
  ctx.strokeStyle = '#2e7d32';
  ctx.beginPath();
  ctx.moveTo(plant3X, plant3Y);
  ctx.lineTo(plant3X, size * 0.75);
  ctx.stroke();

  // Leaves
  ctx.fillStyle = '#4caf50';
  // Left leaf
  ctx.beginPath();
  ctx.ellipse(plant3X - size * 0.05, plant3Y, size * 0.06, size * 0.03, -Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();
  // Right leaf
  ctx.beginPath();
  ctx.ellipse(plant3X + size * 0.05, plant3Y, size * 0.06, size * 0.03, Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

// Create directories
const dirs = [
  'resources',
  'android/app/src/main/res/mipmap-mdpi',
  'android/app/src/main/res/mipmap-hdpi',
  'android/app/src/main/res/mipmap-xhdpi',
  'android/app/src/main/res/mipmap-xxhdpi',
  'android/app/src/main/res/mipmap-xxxhdpi'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Generate icons
const icons = [
  { path: 'resources/icon.png', size: 1024 },
  { path: 'android/app/src/main/res/mipmap-mdpi/ic_launcher.png', size: 48 },
  { path: 'android/app/src/main/res/mipmap-hdpi/ic_launcher.png', size: 72 },
  { path: 'android/app/src/main/res/mipmap-xhdpi/ic_launcher.png', size: 96 },
  { path: 'android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png', size: 144 },
  { path: 'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png', size: 192 },
  { path: 'android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png', size: 48 },
  { path: 'android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png', size: 72 },
  { path: 'android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png', size: 96 },
  { path: 'android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png', size: 144 },
  { path: 'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png', size: 192 },
  { path: 'android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png', size: 108 },
  { path: 'android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png', size: 162 },
  { path: 'android/app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png', size: 216 },
  { path: 'android/app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png', size: 324 },
  { path: 'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png', size: 432 }
];

icons.forEach(({ path: iconPath, size }) => {
  const canvas = createGardenIcon(size);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(iconPath, buffer);
  console.log(`Created: ${iconPath} (${size}x${size})`);
});

console.log('\nAll icons generated successfully!');
console.log('The app icon has been updated for Android.');