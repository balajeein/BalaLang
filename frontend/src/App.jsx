import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Terminal } from './components/Terminal';
import { MonacoEditor } from './components/MonacoEditor';
import { executeCode, DEFAULT_CODE } from './utils/language';
import {
  Search,
  MoreVertical,
  Moon,
  Sun,
  Palette,
  Globe,
  ChevronLeft,
  ChevronRight,
  Columns,
  Layout,
  Split,
  Play,
  PanelBottom
} from 'lucide-react';

function App() {
  // --- State ---
  const [activePanel, setActivePanel] = useState('explorer');
  const [isTerminalCollapsed, setIsTerminalCollapsed] = useState(false);
  const [activeFile, setActiveFile] = useState('main.bhai');
  const [terminalOutput, setTerminalOutput] = useState([
    { type: 'system', text: 'BalaLang IDE v1.0.0 initializing...' },
    { type: 'system', text: 'Terminal ready 🚀' }
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [terminalSocket, setTerminalSocket] = useState(null);



  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  // File System State (in-memory fake fs)
  const [files, setFiles] = useState([
    { id: 'main.bhai', name: 'main.bhai', content: DEFAULT_CODE }
  ]);

  // Derived state
  const activeFileObj = files.find(f => f.id === activeFile);

  // --- Handlers ---
  const handleEditorChange = (value) => {
    setFiles(prev => prev.map(f =>
      f.id === activeFile ? { ...f, content: value } : f
    ));
  };

  const handleCreateFile = (name) => {
    if (files.some(f => f.name === name)) return;

    // Default content for new files
    const newContent = name.endsWith('.bhai')
      ? '# Heavy coding ho rahi hai'
      : '';

    const newFile = {
      id: name,
      name,
      content: newContent
    };

    setFiles(prev => [...prev, newFile]);
    setActiveFile(newFile.id);
  };

  const closeFile = (id, e) => {
    e.stopPropagation();
    if (files.length <= 1) return; // Don't close last file

    const newFiles = files.filter(f => f.id !== id);
    setFiles(newFiles);

    if (activeFile === id) {
      setActiveFile(newFiles[0].id);
    }
  };

  const handleRunCode = async () => {
    if (!activeFileObj || (!activeFileObj.name.endsWith('.bhai') && !activeFileObj.name.endsWith('.py'))) return;
    if (!terminalSocket) return;

    setIsRunning(true);
    // Expand terminal if collapsed
    if (isTerminalCollapsed) setIsTerminalCollapsed(false);

    // Clear and focus terminal
    // We'll trust the Terminal component to handle its internal xterm state

    // Execute via backend Socket.io
    terminalSocket.emit('execute', { code: activeFileObj.content });

    // We'll reset isRunning on next cycle (or leave it if streaming is forever)
    // For now, let's just mark it as running
    setTimeout(() => setIsRunning(false), 2000); // Simple visual feedback
  };

  // --- Render ---
  return (
    <div className="app-container">
      {/* Main Content Area */}
      <div className="main-layout" style={{ height: '100%' }}>
        <Sidebar
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          files={files}
          activeFile={activeFile}
          setActiveFile={setActiveFile}
          createFile={handleCreateFile}
          runCode={handleRunCode}
          isRunning={isRunning}
        />

        {/* Editor & Terminal Column */}
        <div className="editor-area">
          {/* Editor Tabs */}
          {files.length > 0 && (
            <div className="tab-bar">
              <div style={{ display: 'flex', overflowX: 'auto', overflowY: 'hidden', flex: 1, scrollbarWidth: 'none', height: '100%' }}>
                {files.map(file => (
                  <div
                    key={file.id}
                    className={`tab ${activeFile === file.id ? 'active' : ''}`}
                    onClick={() => setActiveFile(file.id)}
                  >
                    <div className="tab-icon">
                      {file.name.endsWith('.bhai') ? (
                        <div
                          style={{
                            width: '16px',
                            height: '16px',
                            background: '#2d2d2d',
                            border: '1px solid #FFA500',
                            borderRadius: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '8px',
                            fontWeight: 'bold',
                            color: '#FFA500',
                            letterSpacing: '0.5px'
                          }}
                        >
                          BL
                        </div>
                      ) : (
                        <span style={{ color: '#E34F26', fontSize: '14px' }}>📄</span>
                      )}
                    </div>
                    <span>{file.name}</span>
                    <button className="tab-close" onClick={(e) => closeFile(file.id, e)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ position: 'relative', padding: '0 10px', display: 'flex', gap: '8px', alignItems: 'center', background: 'var(--bg-tab)', height: '100%', borderLeft: '1px solid var(--border-color)' }}>
                <button
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: isRunning ? 0.5 : 1 }}
                  title="Run Program"
                  onClick={handleRunCode}
                  disabled={isRunning}
                >
                  <Play size={16} color={isRunning ? "#cca700" : "#89d185"} />
                </button>

                <button
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  title="Split Editor"
                >
                  <Split size={16} color="#cccccc" />
                </button>

                <button
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  title="Layout"
                >
                  <Layout size={16} color="#cccccc" />
                </button>

                <button
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  title="Toggle Panel"
                  onClick={() => setIsTerminalCollapsed(!isTerminalCollapsed)}
                >
                  <PanelBottom size={16} color="#cccccc" />
                </button>

              </div>
            </div>
          )}

          {/* Editor Content */}
          <div className="editor-content">
            {files.length === 0 ? (
              <div className="welcome-screen fade-in">
                <div className="welcome-logo">🚀</div>
                <h1>BalaLang IDE</h1>
                <p className="welcome-subtitle">A simple, powerful editor for Hinglish code that compiles directly to Python.</p>
                <div className="welcome-actions">
                  <button className="welcome-action-btn" onClick={() => handleCreateFile('main.bhai')}>
                    New File
                  </button>
                </div>
              </div>
            ) : (
              <MonacoEditor
                activeFileObj={activeFileObj}
                onChange={handleEditorChange}
                onRun={handleRunCode}
                theme="balalang-dark"
                onCursorPositionChange={setCursorPos}
              />
            )}
          </div>

          {/* Terminal */}
          <Terminal
            isCollapsed={isTerminalCollapsed}
            toggleTerminal={() => setIsTerminalCollapsed(!isTerminalCollapsed)}
            clearOutput={() => { }}
            setTerminalSocket={setTerminalSocket}
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="statusbar">
        <div className="statusbar-left">
          <div className="statusbar-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
              <line x1="6" y1="3" x2="6" y2="15"></line>
              <circle cx="18" cy="6" r="3"></circle>
              <circle cx="6" cy="18" r="3"></circle>
              <path d="M18 9a9 9 0 0 1-9 9"></path>
            </svg>
            <span style={{ marginLeft: '4px' }}>main</span>
          </div>
          <div className="statusbar-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span style={{ marginLeft: '4px' }}>0</span>
          </div>
        </div>

        <div className="statusbar-right">
          <div className="statusbar-item">
            Ln {cursorPos.line}, Col {cursorPos.col}
          </div>
          <div className="statusbar-item">
            Spaces: 4
          </div>
          <div className="statusbar-item">
            UTF-8
          </div>
          <div className="statusbar-item clickable">
            {activeFileObj?.name.endsWith('.bhai') ? 'BalaLang' : 'Python'}
          </div>
          <div className="statusbar-item tooltip-wrapper" data-tooltip="No Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </div>
          <div className="statusbar-item">
            {time.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;