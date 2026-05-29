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

console.log('🚀 Starting Medusa server...')
execSync('npx medusa start', { stdio: 'inherit', cwd: root })
