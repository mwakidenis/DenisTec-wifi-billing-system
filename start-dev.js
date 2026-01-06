const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting COLLOSPOT Development Servers...\n');

// Start backend with ts-node (bypasses compilation)
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// Wait 3 seconds then start frontend
setTimeout(() => {
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'inherit',
    shell: true
  });

  frontend.on('close', (code) => {
    console.log(`Frontend exited with code ${code}`);
  });
}, 3000);

backend.on('close', (code) => {
  console.log(`Backend exited with code ${code}`);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill();
  process.exit();
});