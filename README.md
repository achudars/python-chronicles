# Python Chronicles

Run Python code directly in your browser using WebAssembly.

## Features

- Execute Python code in the browser using Pyodide (WebAssembly)
- Code syntax highlighting with CodeMirror
- Load Python files from the server
- View execution output in real-time

## Tech Stack

- Next.js with TypeScript
- Tailwind CSS for styling
- Pyodide for Python execution in WebAssembly
- CodeMirror for the code editor

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. The application loads a Python file (`hello.py`) from the server
2. Pyodide (WebAssembly Python runtime) is initialized in the browser
3. When you click the run button, the code is executed using Pyodide
4. Output is captured and displayed in the console area
