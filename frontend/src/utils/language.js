// Default starter code for new files
export const DEFAULT_CODE = `# Click on setting to see all BalaLang Docs

# if else ko aise likhna hai
a = 10
b = 20
agar a < b :
    bol("a sabse chota")
nahi_to b < a:
    bol("b sabse chota")
warna:
    bol("dono equal hai")
# output -> a sabse chota

# loop aise chalana hai
lst = []
chala i in range(5):
    lst.dalde(i+1)
bol(lst)
# output -> [1,2,3,4,5]

# function banana
kaam square(n):
    n = n*n
    bhej n
bol(square(5))
# output -> 25
`;

// Compiler keyword mapping (for frontend display)
export const KEYWORD_MAP = {
  'agar': 'if',
  'nahi_to': 'elif',
  'warna': 'else',
  'chala': 'for',
  'jabtak': 'while',
  'rukja': 'break',
  'skipkr': 'continue',
  'kaam': 'def',
  'bhej': 'return',
  'bol': 'print',
  'sun': 'input',
  'aur': 'and',
  'ya': 'or',
  'nahi': 'not',
  'sahi_hai': 'True',
  'galat_hai': 'False',
  'kuch_nahi': 'None',
  'sabse_bada': 'max',
  'sabse_chota': 'min',
  'add': 'sum',
  'len': 'len',
  'exact': 'abs',
  'round': 'round',
  'range': 'range',
  'type': 'type',
  'int': 'int',
  'float': 'float',
  'str': 'str',
  'list': 'list',
  'dalde': 'append',
  'nikal_de': 'pop',
};

// Monaco language definition for BalaLang
export function registerBalaLang(monaco) {
  // Register the language
  monaco.languages.register({ id: 'balalang' });

  // Register language configuration for auto-indent and auto-close
  monaco.languages.setLanguageConfiguration('balalang', {
    comments: {
      lineComment: '#',
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')'],
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
    indentationRules: {
      // Indent after any line ending with a colon
      increaseIndentPattern: /:\s*$/,
      // Decrease indent for lines that clearly end a block (though Python-style doesn't use this as much)
      decreaseIndentPattern: /^\s*(warna:|nahi_to\s+.*:)/,
    },
    onEnterRules: [
      {
        // If the current line starts a block, indent the next line
        beforeText: /:\s*$/,
        action: { indentAction: monaco.languages.IndentAction.Indent },
      },
    ],
  });

  // Define tokens
  monaco.languages.setMonarchTokensProvider('balalang', {
    keywords: [
      'agar', 'nahi_to', 'warna', 'chala', 'jabtak',
      'rukja', 'skipkr', 'kaam', 'bhej', 'aur', 'ya', 'nahi',
      'sahi_hai', 'galat_hai', 'kuch_nahi', 'in', 'pass', 'class',
      'import', 'from', 'as', 'try', 'except', 'finally',
      'raise', 'with', 'lambda', 'yield', 'global', 'nonlocal',
      'assert', 'del',
    ],
    builtins: [
      'bol', 'sun', 'sabse_bada', 'sabse_chota', 'add',
      'len', 'exact', 'round', 'range', 'type',
      'int', 'float', 'str', 'list', 'dalde', 'nikal_de',
    ],
    operators: [
      '=', '>', '<', '!', '~', '?', ':',
      '==', '<=', '>=', '!=', '&&', '||',
      '++', '--', '+', '-', '*', '/', '&', '|',
      '^', '%', '<<', '>>', '>>>', '+=', '-=',
      '*=', '/=', '&=', '|=', '^=', '%=',
      '<<=', '>>=', '>>>=', '**', '//',
    ],
    symbols: /[=><!~?:&|+\-*/^%]+/,

    tokenizer: {
      root: [
        // Comments
        [/#.*$/, 'comment'],

        // Strings
        [/f?"""/, 'string', '@tripleDoubleString'],
        [/f?'''/, 'string', '@tripleSingleString'],
        [/f?"([^"\\]|\\.)*$/, 'string.invalid'],
        [/f?'([^'\\]|\\.)*$/, 'string.invalid'],
        [/f?"/, 'string', '@doubleString'],
        [/f?'/, 'string', '@singleString'],

        // Numbers
        [/\d*\.\d+([eE][-+]?\d+)?/, 'number.float'],
        [/0[xX][0-9a-fA-F]+/, 'number.hex'],
        [/0[oO][0-7]+/, 'number.octal'],
        [/0[bB][01]+/, 'number.binary'],
        [/\d+/, 'number'],

        // Decorators
        [/@\w+/, 'tag'],

        // Identifiers and keywords
        [/[a-zA-Z_]\w*/, {
          cases: {
            '@keywords': 'keyword',
            '@builtins': 'type.identifier',
            '@default': 'identifier',
          },
        }],

        // Whitespace
        [/[ \t\r\n]+/, 'white'],

        // Operators
        [/@symbols/, {
          cases: {
            '@operators': 'operator',
            '@default': '',
          },
        }],

        // Delimiters
        [/[{}()[\]]/, '@brackets'],
        [/[,;.]/, 'delimiter'],
      ],

      tripleDoubleString: [
        [/[^"]+/, 'string'],
        [/"""/, 'string', '@pop'],
        [/"/, 'string'],
      ],
      tripleSingleString: [
        [/[^']+/, 'string'],
        [/'''/, 'string', '@pop'],
        [/'/, 'string'],
      ],
      doubleString: [
        [/[^\\"]+/, 'string'],
        [/\\./, 'string.escape'],
        [/"/, 'string', '@pop'],
      ],
      singleString: [
        [/[^\\']+/, 'string'],
        [/\\./, 'string.escape'],
        [/'/, 'string', '@pop'],
      ],
    },
  });

  // Define theme
  monaco.editor.defineTheme('balalang-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
      { token: 'type.identifier', foreground: 'DCDCAA' },
      { token: 'identifier', foreground: '9CDCFE' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'string.escape', foreground: 'D7BA7D' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'number.float', foreground: 'B5CEA8' },
      { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
      { token: 'operator', foreground: 'D4D4D4' },
      { token: 'tag', foreground: 'DCDCAA' },
      { token: 'delimiter', foreground: 'D4D4D4' },
    ],
    colors: {
      'editor.background': '#131313',
      'editor.foreground': '#d4d4d4',
      'editor.lineHighlightBackground': '#1a1a1a',
      'editor.selectionBackground': '#264f78',
      'editor.inactiveSelectionBackground': '#3a3d41',
      'editorCursor.foreground': '#aeafad',
      'editorWhitespace.foreground': '#3b3b3b',
      'editorIndentGuide.background': '#404040',
      'editorIndentGuide.activeBackground': '#707070',
      'editorLineNumber.foreground': '#858585',
      'editorLineNumber.activeForeground': '#c6c6c6',
      'editor.selectionHighlightBackground': '#add6ff26',
    },
  });

  // Define Light Theme
  monaco.editor.defineTheme('balalang-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
      { token: 'type.identifier', foreground: '267F99' },
      { token: 'identifier', foreground: '001080' },
      { token: 'string', foreground: 'A31515' },
      { token: 'comment', foreground: '008000', fontStyle: 'italic' },
      { token: 'number', foreground: '098658' },
    ],
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#333333',
      'editor.lineHighlightBackground': '#f3f3f3',
      'editor.selectionBackground': '#add6ff',
      'editorCursor.foreground': '#000000',
    },
  });

  // Auto-completion
  monaco.languages.registerCompletionItemProvider('balalang', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions = [
        ...Object.keys(KEYWORD_MAP).map(kw => ({
          label: kw,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: kw,
          detail: `→ ${KEYWORD_MAP[kw]}`,
          documentation: `BalaLang keyword that compiles to Python's \`${KEYWORD_MAP[kw]}\``,
          range,
        })),
        {
          label: 'kaam',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'kaam ${1:function_name}(${2:args}):\n    ${3:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'Function definition',
          documentation: 'Define a new function (kaam → def)',
          range,
        },
        {
          label: 'agar-warna',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'agar ${1:condition}:\n    ${2:pass}\nwarna:\n    ${3:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'If-else statement',
          documentation: 'If-else block (agar → if, warna → else)',
          range,
        },
        {
          label: 'chala',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'chala ${1:item} in ${2:items}:\n    ${3:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'For loop',
          documentation: 'For loop (chala → for)',
          range,
        },
        {
          label: 'jabtak',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'jabtak ${1:condition}:\n    ${2:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'While loop',
          documentation: 'While loop (jabtak → while)',
          range,
        },
      ];

      return { suggestions };
    },
  });
}

// API calls
const API_BASE = 'https://balalang.onrender.com/api';

export async function executeCode(code) {
  try {
    const response = await fetch(`${API_BASE}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    return await response.json();
  } catch (error) {
    return {
      success: false,
      output: '',
      error: 'bhai server se connection nahi ho raha 😵\nMake sure backend is running on port 3001',
    };
  }
}

export async function compileCode(code) {
  try {
    const response = await fetch(`${API_BASE}/compile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    return await response.json();
  } catch (error) {
    return { error: 'Server connection failed' };
  }
}
