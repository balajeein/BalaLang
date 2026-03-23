# BalaLang IDE: Coding in Hinglish! 

Hey! This is **BalaLang** — a personal project I built because I wanted a coding environment that felt more... "desi". It's a full-stack IDE that lets you write logic using **Hinglish** keywords (like `agar`, `bol`, `kaam`, etc.) and runs them instantly using Python under the hood.

---

## 🛠️ How it's Built (The Tech Under the Hood)

I didn't want this to just be a text box; I wanted a real IDE feel. Here’s what’s going on in the engine room:

### 1. The Editor (Monaco + Custom Grammar)
I'm using **Monaco Editor** (the same engine that powers VS Code). 
*   **The Magic**: I wrote a custom **Monarch provider** to handle syntax highlighting. It detects Hinglish keywords like `dalde` and `warna` and maps them to professional editor colors so it doesn't just look like plain text.

### 2. The Transpiler (Regex Magic)
Built a lightweight **Transpiler** in Node.js. 
*   It uses sorted RegEx patterns to swap Hinglish keywords for Python equivalents without breaking your logic or your strings. 
*   It preserves your indentations perfectly so Python doesn't scream at you.

### 3. The Terminal (Xterm.js + node-pty + WebSockets)
This is my favorite part. It’s NOT just a fake output log.
*   **True PTY**: I used `node-pty` on the backend to spawn a real pseudoterminal.
*   **Real-time**: Connected it via **Socket.io** to **Xterm.js** in the frontend. 
*   **Result**: You get a real interactive shell where you can actually use `sun()` (input) and see real-time execution, just like a pro dev environment.

### 4. The UI (React + Vite)
Built the whole thing with **React** and **Vite** for that lightning-fast HMR. The UI is a custom "Deep Dark" theme inspired by VS Code, but with custom **"BL" branding** and a status bar that keeps track of your line numbers and current time.

---

## 📖 The Language Map (Cheat Sheet)

| Hinglish | Python | Verbose Meaning |
| :--- | :--- | :--- |
| `bol` | `print` | Output something |
| `sun` | `input` | Take input from user |
| `agar` | `if` | The conditional check |
| `chala` | `for` | The loop starter |
| `kaam` | `def` | Defining a function |
| `dalde` | `append` | Shoving it in a list |
| `nikal_de` | `pop` | Taking it out |
| `sahi_hai` | `True` | Fact. |
| `galat_hai` | `False` | Cap. |

---

## Run it Locally

If you want to play with the code:

1.  **Clone it**: `git clone https://github.com/balajee/BalaLang.git`
2.  **Backend**: `cd backend && npm install && npm run dev` (Starts the PTY server on port 5000)
3.  **Frontend**: `cd frontend && npm install && npm run dev` (Launch the IDE on port 5173)

### Why I built this?
Honestly? For the fun of it. Coding can feel stiff sometimes, and adding a bit of flavor with labels like `sahi_hai` makes the whole process feel less like work and more like building with a friend.

---

**Made with love by Balajee.** 
