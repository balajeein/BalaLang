import React, { useState } from 'react';
import {
  Files,
  Search,
  GitBranch,
  Play,
  Settings,
  ChevronRight,
  ChevronDown,
  FileCode,
  FilePlus,
  FolderPlus,
  RefreshCw,
  ListCollapse
} from 'lucide-react';
import { KEYWORD_MAP } from '../utils/language';

export function Sidebar({
  activePanel,
  setActivePanel,
  files,
  activeFile,
  setActiveFile,
  createFile,
  runCode,
  isRunning
}) {
  const [isExplorerExpanded, setIsExplorerExpanded] = useState(true);
  const [newFileName, setNewFileName] = useState('');
  const [isCreatingFile, setIsCreatingFile] = useState(false);

  const ActivityIcon = ({ id, icon: Icon, tooltip }) => (
    <div className="tooltip-wrapper" data-tooltip={tooltip}>
      <div
        className={`activity-icon ${activePanel === id ? 'active' : ''}`}
        onClick={() => setActivePanel(activePanel === id ? null : id)}
      >
        <Icon size={24} strokeWidth={1.5} />
      </div>
    </div>
  );

  const handleCreateFile = (e) => {
    if (e.key === 'Enter') {
      if (newFileName.trim()) {
        const name = newFileName.endsWith('.bhai') ? newFileName : `${newFileName}.bhai`;
        createFile(name);
      }
      setIsCreatingFile(false);
      setNewFileName('');
    } else if (e.key === 'Escape') {
      setIsCreatingFile(false);
      setNewFileName('');
    }
  };

  return (
    <>
      <div className="activity-bar">
        <div className="activity-bar-top">
          <ActivityIcon id="explorer" icon={Files} tooltip="Explorer" />
          <ActivityIcon id="search" icon={Search} tooltip="Search" />
          <ActivityIcon id="git" icon={GitBranch} tooltip="Source Control" />
          <ActivityIcon id="run" icon={Play} tooltip="Run & Debug" />
        </div>
        <div className="activity-bar-bottom">

          <ActivityIcon id="settings" icon={Settings} tooltip="Manage" />
        </div>
      </div>

      <div className={`sidebar-panel ${!activePanel ? 'hidden' : ''}`}>
        {activePanel === 'explorer' && (
          <div className="fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="sidebar-header">
              <span>EXPLORER</span>
            </div>

            <div className="sidebar-content">
              <div className="explorer-section">
                <div
                  className={`explorer-section-header ${!isExplorerExpanded ? 'collapsed' : ''}`}
                  onClick={() => setIsExplorerExpanded(!isExplorerExpanded)}
                >
                  {isExplorerExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <span>BALALANG_PROJECT</span>

                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
                    <div
                      className="file-action-btn"
                      onClick={(e) => { e.stopPropagation(); setIsCreatingFile(true); setIsExplorerExpanded(true); }}
                      title="New File"
                    >
                      <FilePlus size={14} />
                    </div>
                    <div className="file-action-btn" onClick={(e) => e.stopPropagation()} title="New Folder">
                      <FolderPlus size={14} />
                    </div>
                    <div className="file-action-btn" onClick={(e) => e.stopPropagation()} title="Refresh Explorer">
                      <RefreshCw size={14} />
                    </div>
                    <div className="file-action-btn" onClick={(e) => { e.stopPropagation(); setIsExplorerExpanded(false); }} title="Collapse Folders">
                      <ListCollapse size={14} />
                    </div>
                  </div>
                </div>

                {isExplorerExpanded && (
                  <ul className="file-tree">
                    {files.map(file => (
                      <li
                        key={file.id}
                        className={`file-item ${activeFile === file.id ? 'active' : ''}`}
                        onClick={() => setActiveFile(file.id)}
                      >
                        <div className="file-item-icon">
                          <FileCode size={16} color="#569CD6" />
                        </div>
                        <span className="file-item-name">{file.name}</span>
                      </li>
                    ))}

                    {isCreatingFile && (
                      <li className="new-file-input">
                        <FileCode size={16} color="#569CD6" style={{ marginRight: '6px' }} />
                        <input
                          autoFocus
                          value={newFileName}
                          onChange={(e) => setNewFileName(e.target.value)}
                          onKeyDown={handleCreateFile}
                          onBlur={() => setIsCreatingFile(false)}
                          placeholder="file.bhai"
                        />
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {activePanel === 'run' && (
          <div className="fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="sidebar-header">
              <span>RUN & DEBUG</span>
            </div>

            <div className="debug-panel">
              <button
                className={`run-btn ${isRunning ? 'running' : ''}`}
                onClick={runCode}
                disabled={isRunning}
              >
                {isRunning ? (
                  <>
                    <div className="spinner"></div>
                    <span>Chal Raha Hai...</span>
                  </>
                ) : (
                  <>
                    <Play size={18} fill="currentColor" />
                    <span>Run BalaLang</span>
                  </>
                )}
              </button>


            </div>
          </div>
        )}

        {activePanel === 'settings' && (
          <div className="fade-in settings-panel">
            <h2><Settings size={20} /> BalaLang Docs</h2>
            <p>Welcome to BalaLang! This is a simple wrapper over Python using Hinglish keywords.</p>

            <h3>Keywords</h3>
            <table className="keyword-table">
              <thead>
                <tr>
                  <th>BalaLang</th>
                  <th>Python</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(KEYWORD_MAP).map(([keyword, py]) => (
                  <tr key={keyword}>
                    <td>{keyword}</td>
                    <td>{py}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>Example</h3>
            <div className="code-example">
              {`agar name == "Bhai":
    bol("Swagat hai!")
warna:
    bol("Kaun ho tum?")`}
            </div>
          </div>
        )}


      </div>
    </>
  );
}
