const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return null;
  }
}

function getGzippedSize(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    const gzipped = zlib.gzipSync(content);
    return gzipped.length;
  } catch (error) {
    return null;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  if (bytes === null) return 'N/A';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

console.log('📦 Bundle Size Analysis\n');

// Analyze clsnx
const clsnxJs = path.join(__dirname, '../dist/index.js');
const clsnxDts = path.join(__dirname, '../dist/index.d.ts');

const clsnxJsSize = getFileSize(clsnxJs);
const clsnxJsGzipped = getGzippedSize(clsnxJs);
const clsnxDtsSize = getFileSize(clsnxDts);

console.log('🚀 clsnx:');
console.log(`   JavaScript: ${formatBytes(clsnxJsSize)} (${formatBytes(clsnxJsGzipped)} gzipped)`);
console.log(`   TypeScript definitions: ${formatBytes(clsnxDtsSize)}`);
console.log(`   Total: ${formatBytes(clsnxJsSize + (clsnxDtsSize || 0))}`);

// Analyze classnames
const classnamesPath = path.join(__dirname, '../node_modules/classnames/index.js');
const classnamesDedupeePath = path.join(__dirname, '../node_modules/classnames/dedupe.js');
const classnamesDtsPath = path.join(__dirname, '../node_modules/classnames/index.d.ts');

const classnamesSize = getFileSize(classnamesPath);
const classnamesGzipped = getGzippedSize(classnamesPath);
const classnamesDedupeSize = getFileSize(classnamesDedupeePath);
const classnamesDedupeGzipped = getGzippedSize(classnamesDedupeePath);
const classnamesDtsSize = getFileSize(classnamesDtsPath);

console.log('\n📊 classnames:');
console.log(`   JavaScript: ${formatBytes(classnamesSize)} (${formatBytes(classnamesGzipped)} gzipped)`);
console.log(`   Dedupe version: ${formatBytes(classnamesDedupeSize)} (${formatBytes(classnamesDedupeGzipped)} gzipped)`);
console.log(`   TypeScript definitions: ${formatBytes(classnamesDtsSize)}`);
console.log(`   Total: ${formatBytes(classnamesSize + (classnamesDtsSize || 0))}`);

// Comparison
console.log('\n🎯 Size Comparison:');

if (clsnxJsGzipped && classnamesGzipped) {
  const diff = clsnxJsGzipped - classnamesGzipped;
  const percentDiff = ((diff / classnamesGzipped) * 100).toFixed(1);
  
  if (diff > 0) {
    console.log(`   clsnx is ${formatBytes(diff)} (${percentDiff}%) larger than classnames (gzipped)`);
  } else {
    console.log(`   clsnx is ${formatBytes(Math.abs(diff))} (${Math.abs(percentDiff)}%) smaller than classnames (gzipped)`);
  }
}

if (clsnxJsGzipped && classnamesDedupeGzipped) {
  const diff = clsnxJsGzipped - classnamesDedupeGzipped;
  const percentDiff = ((diff / classnamesDedupeGzipped) * 100).toFixed(1);
  
  if (diff > 0) {
    console.log(`   clsnx is ${formatBytes(diff)} (${percentDiff}%) larger than classnames/dedupe (gzipped)`);
  } else {
    console.log(`   clsnx is ${formatBytes(Math.abs(diff))} (${Math.abs(percentDiff)}%) smaller than classnames/dedupe (gzipped)`);
  }
}

// Bundle analyzer details
console.log('\n🔍 Detailed Analysis:');

// Show actual file contents size breakdown
if (clsnxJsSize) {
  console.log(`\n📄 clsnx source breakdown:`);
  try {
    const content = fs.readFileSync(clsnxJs, 'utf8');
    const lines = content.split('\n').length;
    const chars = content.length;
    console.log(`   Lines of code: ${lines}`);
    console.log(`   Characters: ${chars.toLocaleString()}`);
    console.log(`   Compression ratio: ${((1 - clsnxJsGzipped/clsnxJsSize) * 100).toFixed(1)}%`);
  } catch (e) {
    console.log('   Could not analyze source');
  }
}

if (classnamesSize) {
  console.log(`\n📄 classnames source breakdown:`);
  try {
    const content = fs.readFileSync(classnamesPath, 'utf8');
    const lines = content.split('\n').length;
    const chars = content.length;
    console.log(`   Lines of code: ${lines}`);
    console.log(`   Characters: ${chars.toLocaleString()}`);
    console.log(`   Compression ratio: ${((1 - classnamesGzipped/classnamesSize) * 100).toFixed(1)}%`);
  } catch (e) {
    console.log('   Could not analyze source');
  }
}

console.log('\n✨ Summary:');
console.log(`   🎯 clsnx (gzipped): ${formatBytes(clsnxJsGzipped)}`);
console.log(`   📊 classnames (gzipped): ${formatBytes(classnamesGzipped)}`);
console.log(`   📊 classnames/dedupe (gzipped): ${formatBytes(classnamesDedupeGzipped)}`);