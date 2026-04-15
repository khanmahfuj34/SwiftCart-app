const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add 'cjs' to the list of file extensions Metro knows how to bundle.
// This natively fixes the Firebase idb/.cjs resolution bug.
config.resolver.sourceExts.push('cjs');

module.exports = config;
