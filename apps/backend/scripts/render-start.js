#!/usr/bin/env node
/**
 * Smart production start script for Render.com
 * Render strips .gitignore'd files (like .medusa/) between build and deploy phases.
 * This script rebuilds if the admin bundle is missing, then starts the server.
 */
const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const root = path.join(__dirname, '..')
const adminIndex = path.join(root, '.medusa', 'server', 'public', 'admin', 'index.html')

if (!fs.existsSync(adminIndex)) {
  console.log('⚡ Admin build not found — running medusa build first...')
  execSync('npx medusa build', { stdio: 'inherit', cwd: root })
  console.log('✅ Build complete!')
} else {
  console.log('✅ Admin build found — skipping rebuild.')
}

// ── Create symlink so medusa start can find public/admin/index.html ──
const publicSymlink = path.join(root, 'public')
try {
  const stat = fs.lstatSync(publicSymlink)
  if (stat.isSymbolicLink() || stat.isDirectory() || stat.isFile()) {
    console.log('⚡ Removing existing public path for clean symlink...')
    fs.rmSync(publicSymlink, { recursive: true, force: true })
  }
} catch (e) {
  // Path does not exist, safe to proceed
}

console.log('⚡ Creating symlink for public directory...')
try {
  fs.symlinkSync('.medusa/server/public', publicSymlink, 'dir')
  console.log('✅ Symlink created!')
} catch (err) {
  console.error('⚠️ Failed to create public symlink:', err.message)
}

console.log('🚀 Starting Medusa server...')
execSync('npx medusa start', { stdio: 'inherit', cwd: root })
