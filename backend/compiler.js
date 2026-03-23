/**
 * BalaLang Compiler
 * Transpiles Hinglish-style code into valid Python
 */

const KEYWORD_MAP = {
  // Control flow
  'agar': 'if',
  'nahi_to': 'elif',
  'warna': 'else',
  'chala': 'for',
  'jabtak': 'while',
  'rukja': 'break',
  'skipkr': 'continue',

  // Functions
  'kaam': 'def',
  'bhej': 'return',

  // IO
  'bol': 'print',
  'sun': 'input',

  // Logical operators
  'aur': 'and',
  'ya': 'or',
  'nahi': 'not',
  'sahi_hai': 'True',
  'galat_hai': 'False',
  'kuch_nahi': 'None',

  // Built-ins
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

const SORTED_KEYWORDS = Object.keys(KEYWORD_MAP).sort((a, b) => b.length - a.length);

const REVERSE_KEYWORD_MAP = Object.fromEntries(
  Object.entries(KEYWORD_MAP).map(([bala, py]) => [py, bala])
);

const SORTED_PY_KEYWORDS = Object.values(KEYWORD_MAP).sort((a, b) => b.length - a.length);

function compile(code) {
  let lines = code.split('\n');
  let compiledLines = [];

  for (let line of lines) {
    let compiledLine = compileLine(line);
    compiledLines.push(compiledLine);
  }

  return compiledLines.join('\n');
}

function compileLine(line) {
  // Preserve leading whitespace
  const leadingWhitespace = line.match(/^(\s*)/)[0];
  let content = line.trimStart();

  // Skip empty lines and comments
  if (content === '' || content.startsWith('#')) {
    return line;
  }

  // Process string literals - protect them from replacement
  const strings = [];
  let stringIndex = 0;

  // Replace string literals with placeholders
  content = content.replace(/("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, (match) => {
    const placeholder = `__STRING_${stringIndex}__`;
    strings.push(match);
    stringIndex++;
    return placeholder;
  });

  // Replace keywords (word boundary aware)
  for (const keyword of SORTED_KEYWORDS) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'g');
    content = content.replace(regex, KEYWORD_MAP[keyword]);
  }

  // Restore string literals
  for (let i = 0; i < strings.length; i++) {
    content = content.replace(`__STRING_${i}__`, strings[i]);
  }

  return leadingWhitespace + content;
}

// Custom error message translator
function translateError(error) {
  const errorMap = [
    { pattern: /SyntaxError/i, message: 'bhai code galat hai 😭 — Syntax Error' },
    { pattern: /NameError/i, message: 'bhai ye variable toh exist hi nahi karta 🤷 — Name Error' },
    { pattern: /TypeError/i, message: 'bhai type galat daal diya tune 😤 — Type Error' },
    { pattern: /IndexError/i, message: 'bhai itna bada list hi nahi hai 📏 — Index Error' },
    { pattern: /KeyError/i, message: 'bhai ye key toh dictionary mein hai hi nahi 🔑 — Key Error' },
    { pattern: /ValueError/i, message: 'bhai value galat hai 💀 — Value Error' },
    { pattern: /ZeroDivisionError/i, message: 'bhai zero se divide nahi kar sakte 🚫 — Division Error' },
    { pattern: /IndentationError/i, message: 'bhai spacing galat hai, indent check kar 📐 — Indentation Error' },
    { pattern: /AttributeError/i, message: 'bhai ye attribute exist nahi karta 🙅 — Attribute Error' },
    { pattern: /ImportError/i, message: 'bhai ye module nahi mil raha 📦 — Import Error' },
    { pattern: /FileNotFoundError/i, message: 'bhai file nahi mili 📁 — File Not Found' },
    { pattern: /RecursionError/i, message: 'bhai infinite loop mein fas gaya 🔄 — Recursion Error' },
  ];

  let translated = error;

  // Replace Python keywords back to BalaLang in the error message
  for (const pyKeyword of SORTED_PY_KEYWORDS) {
    const regex = new RegExp(`\\b${pyKeyword}\\b`, 'g');
    translated = translated.replace(regex, REVERSE_KEYWORD_MAP[pyKeyword]);
  }

  for (const { pattern, message } of errorMap) {
    if (pattern.test(error)) {
      translated = message + '\n' + translated;
      break;
    }
  }

  return translated;
}

module.exports = { compile, translateError };
