import React, { useRef, useEffect, useState } from 'react';
import { X, ChevronUp, Trash2, Terminal as TerminalIcon } from 'lucide-react';
import { io } from 'socket.io-client';

const SOCKET_URL = "https://balalang.onrender.com";

export function Terminal({ isCollapsed, toggleTerminal, clearOutput, setTerminalSocket }) {
  const [lines, setLines] = useState([
    { type: 'system', text: 'BalaLang Terminal v1.0.0 Ready!' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [socket, setSocket] = useState(null);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize Socket.io
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"]
    });
    setSocket(newSocket);
    setTerminalSocket(newSocket);

    newSocket.on('connect', () => {
      setLines(prev => [...prev, { type: 'system', text: 'Backend connected. Ready for Hinglish code!' }]);
    });

    newSocket.on('output', (data) => {
      // Process pty data (remove ANSI codes if simple)
      const cleanData = data.replace(/\x1B\[[0-9;]*[JKmsu]/g, '');
      if (cleanData.trim()) {
        setLines(prev => [...prev, { type: 'output', text: cleanData }]);
      }
    });

    newSocket.on('exit', ({ exitCode }) => {
      setLines(prev => [...prev, { type: 'system', text: `\r\n` }]);
    });

    newSocket.on('error', (err) => {
      setLines(prev => [...prev, { type: 'error', text: `Error: ${err}` }]);
    });

    return () => newSocket.disconnect();
  }, [setTerminalSocket]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const handleInputSubmit = (e) => {
    if (e.key === 'Enter') {
      if (socket) {
        socket.emit('input', inputValue + '\n');
        setLines(prev => [...prev, { type: 'command', text: inputValue }]);
        setInputValue('');
      }
    }
  };

  const handleClear = () => {
    setLines([{ type: 'system', text: 'Terminal cleared.' }]);
  };

  const focusInput = () => {
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className={`bottom-panel ${isCollapsed ? 'collapsed' : ''}`} onClick={focusInput}>
      <div className="panel-header" onClick={(e) => { e.stopPropagation(); isCollapsed && toggleTerminal(); }}>
        <div className="panel-tabs">
          <div className="panel-tab">PROBLEMS <span className="badge">0</span></div>
          <div className="panel-tab active">TERMINAL</div>
          <div className="panel-tab">OUTPUT</div>
          <div className="panel-tab">DEBUG CONSOLE</div>
        </div>

        <div className="panel-actions">
          <button className="panel-action-btn" onClick={(e) => { e.stopPropagation(); handleClear(); }}>
            <Trash2 size={14} />
          </button>
          <button className="panel-action-btn" onClick={(e) => { e.stopPropagation(); toggleTerminal(); }}>
            {isCollapsed ? <ChevronUp size={14} /> : <ChevronUp size={14} style={{ transform: 'rotate(180deg)' }} />}
          </button>
          <button className="panel-action-btn" onClick={(e) => { e.stopPropagation(); if (!isCollapsed) toggleTerminal(); }}>
            <X size={14} />
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="terminal-content" ref={terminalRef} style={{ backgroundColor: '#0b0e14', padding: '12px' }}>
          {lines.map((line, idx) => (
            <div key={idx} className={`terminal-line ${line.type}`} style={{ whiteSpace: 'pre-wrap', marginBottom: '2px' }}>
              {line.text}
            </div>
          ))}

          <div className="terminal-input-line" style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
            <span style={{ color: '#89d185', marginRight: '4px', whiteSpace: 'nowrap' }}>balajee@Balajees-MacBook-Pro BalaLang %</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputSubmit}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#cccccc',
                outline: 'none',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                padding: '0 4px'
              }}
              autoFocus
            />
          </div>
        </div>
      )}
    </div>
  );
}
