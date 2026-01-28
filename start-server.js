const { spawn } = require('child_process');

console.log('🚀 Starting Hindalco Webhook Server...');

const server = spawn('node', ['server.js'], {
  stdio: 'inherit',
  env: { ...process.env }
});

server.on('close', (code) => {
  console.log(`\n📴 Server stopped with code ${code}`);
});

server.on('error', (error) => {
  console.error('❌ Server error:', error);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGTERM');
});