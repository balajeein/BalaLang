const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { spawn } = require('child_process');
const { compile, translateError } = require('./compiler');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ✅ Root route (for testing)
app.get("/", (req, res) => {
  res.send("Backend is running ");
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'BalaLang server is alive!' });
});

// Execute via Socket for Interactivity
io.on('connection', (socket) => {
  let activeProcess = null;

  // Handle Code Execution
  socket.on('execute', ({ code }) => {
    if (activeProcess) {
      activeProcess.kill();
    }

    try {
      const pythonCode = compile(code);

      // Use standard spawn (more reliable than pty for simple I/O)
      activeProcess = spawn('python3', ['-u', '-c', pythonCode], {
        env: { ...process.env, PYTHONUNBUFFERED: '1' }
      });

      activeProcess.stdout.on('data', (data) => {
        socket.emit('output', data.toString());
      });

      activeProcess.stderr.on('data', (data) => {
        socket.emit('output', translateError(data.toString()));
      });

      activeProcess.on('close', (exitCode) => {
        socket.emit('exit', { exitCode });
        activeProcess = null;
      });

    } catch (err) {
      socket.emit('error', translateError(err.message));
    }
  });

  // Handle User Input (Standard In)
  socket.on('input', (data) => {
    if (activeProcess && activeProcess.stdin.writable) {
      activeProcess.stdin.write(data);
    }
  });

  socket.on('disconnect', () => {
    if (activeProcess) {
      activeProcess.kill();
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 BalaLang Backend interactive on port ${PORT}`);
});
