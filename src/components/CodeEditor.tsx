"use client";

import { useEffect, useState, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { PlayIcon } from "./Icons";

declare global {
  interface Window {
    loadPyodide: any;
    pyodide: any;
  }
}

const CodeEditor = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);

  // Load Pyodide script and Python file when the component mounts
  useEffect(() => {
    const loadPyodideScript = async () => {
      try {
        setIsLoading(true);

        // Create a fixed sample Python code
        const sampleCode = `# Simple Python script to demonstrate Python running in WebAssembly
# Click the play button to execute this code

print("Hello from Python Chronicles!")
print("Python is running in WebAssembly!")

print("\\nLet's calculate some squares:")
for i in range(1, 6):
    print(f"{i} squared is {i**2}")

languages = ["Python", "JavaScript", "WebAssembly"]
print(f"\\nLanguages used in this project: {', '.join(languages)}")
    
print("\\nThis code is executed using Pyodide - Python in WebAssembly")
`;

        // Set the code to our safe sample
        setCode(sampleCode);

        // Load Pyodide script from CDN
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
        script.async = true;

        // Create a promise to wait for the script to load
        const scriptLoadPromise = new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });

        // Add the script to the document
        document.head.appendChild(script);

        // Wait for the script to load
        await scriptLoadPromise;

        // Initialize Pyodide with explicit options
        window.pyodide = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
          stdin: () => "",
        });

        // Set Pyodide as ready
        setPyodideReady(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load Pyodide:", error);
        setOutput(`Error loading Python environment: ${error instanceof Error ? error.message : String(error)}`);
        setIsLoading(false);
      }
    };

    loadPyodideScript();
  }, []);
  // Function to run Python code
  const runCode = useCallback(async () => {
    if (!pyodideReady || !window.pyodide || isRunning) return;

    setIsRunning(true);
    setOutput("");

    try {
      // Create a capture for stdout
      const outputCapture: string[] = [];

      // Set up stdout capturing
      window.pyodide.setStdout({
        write: (text: string) => {
          outputCapture.push(text);
        },
        flush: () => { }
      });

      // Run the code that's in the editor - this is already our safe code
      await window.pyodide.runPython(code);

      // Update output state with captured stdout
      const capturedOutput = outputCapture.join("");

      if (capturedOutput) {
        setOutput(capturedOutput);
      }
    } catch (error) {
      console.error("Error executing Python code:", error);
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsRunning(false);
    }
  }, [code, isRunning, pyodideReady]);

  return (
    <div className="flex flex-col h-full">
      {/* Code editor header */}
      <div className="editor-header flex items-center justify-between p-3 border-b">
        <span className="text-sm">hello.py</span>
        <button
          onClick={runCode}
          disabled={isLoading || isRunning || !pyodideReady}
          className={`p-2 rounded-full run-button ${isLoading || isRunning || !pyodideReady
              ? 'run-button-disabled'
              : 'run-button-active'
            }`}
          aria-label="Run Python code"
          title="Run Python code"
        >
          <PlayIcon />
        </button>
      </div>

      {/* Code editor */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="loading-container h-full flex items-center justify-center">
            Loading Python environment...
          </div>
        ) : (
          <CodeMirror
            value={code}
            height="100%"
            onChange={setCode}
            extensions={[python()]}
            theme="dark"
            basicSetup={{
              lineNumbers: true,
              highlightActiveLineGutter: true,
              highlightSpecialChars: true,
              foldGutter: true,
              drawSelection: true,
              dropCursor: true,
              indentOnInput: true,
              syntaxHighlighting: true,
            }}
          />
        )}
      </div>

      {/* Output console */}
      <div className="output-console h-1/4 min-h-[100px] border-t p-3 text-gray-300 font-mono overflow-y-auto">
        <div className="text-xs text-gray-400 mb-1">Output:</div>
        <pre className="whitespace-pre-wrap">
          {(() => {
            if (isLoading) return "Initializing Python environment...";
            if (isRunning) return "Running code...";
            return output || "Run the code to see the output";
          })()}
        </pre>
      </div>
    </div>
  );
};

export default CodeEditor;
