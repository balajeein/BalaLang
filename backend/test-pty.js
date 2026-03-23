try {
  const pty = require('node-pty');
  console.log('node-pty is successfully installed! ✅');
  process.exit(0);
} catch (e) {
  console.error('node-pty is NOT working: ❌', e.message);
  process.exit(1);
}
