import React, { useRef, useEffect } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { registerBalaLang } from '../utils/language';
import { Play } from 'lucide-react';

export function MonacoEditor({ activeFileObj, onChange, onRun, theme = 'balalang-dark', onCursorPositionChange }) {
  const monaco = useMonaco();
  const editorRef = useRef(null);

  // Update theme when it changes
  useEffect(() => {
    if (monaco && theme) {
      monaco.editor.setTheme(theme);
    }
  }, [monaco, theme]);

  // Register BalaLang language when Monaco is ready
  useEffect(() => {
    if (monaco) {
      registerBalaLang(monaco);
    }
  }, [monaco]);

  // Handle editor mount
  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Explicitly set theme on mount
    monaco.editor.setTheme(theme);
    
    // Track cursor position for Status Bar
    editor.onDidChangeCursorPosition((e) => {
      onCursorPositionChange({
        line: e.position.lineNumber,
        col: e.position.column
      });
    });
    
    // Add custom keybinding to run code (Ctrl/Cmd + Enter)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun();
    });
  };

  if (!activeFileObj) return null;

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      {/* Editor Header / Breadcrumb area */}
      <div style={{ height: '22px', backgroundColor: '#131313', padding: '2px 10px', fontSize: '12px', color: '#858585', display: 'flex', alignItems: 'center' }}>
        <span>BALALANG_PROJECT</span>
        <span style={{ margin: '0 4px' }}>›</span>
        <span>{activeFileObj.name}</span>

      </div>
      
      {/* Actual Editor Container */}
      <div style={{ height: 'calc(100% - 22px)' }}>
        <Editor
          height="100%"
          language={activeFileObj.name.endsWith('.bhai') ? 'balalang' : 'javascript'}
          theme={theme}
          value={activeFileObj.content}
          onChange={onChange}
          onMount={handleEditorMount}
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            formatOnPaste: true,
            formatOnType: true,
            autoIndent: 'full',
            suggestOnTriggerCharacters: true,
            wordWrap: 'on',
            lineNumbersMinChars: 4,
            padding: { top: 16 },
            renderWhitespace: 'none',
            scrollbar: {
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10
            }
          }}
          loading={
            <div className="spinner" style={{ margin: 'auto' }}></div>
          }
        />
      </div>
    </div>
  );
}
