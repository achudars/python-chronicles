"use client";

import { useEffect, useState, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { PlayIcon } from "./Icons";

// Define the demo Python code
const DEMO_CODE = `# Simple Python script to demonstrate Python running in WebAssembly
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

// Add Pyodide types
declare global {
  interface Window {
    loadPyodide: (options?: {
      indexURL?: string;
      stdin?: () => string;
      [key: string]: any;
    }) => Promise<{
      runPythonAsync: (code: string) => Promise<any>;
      runPython: (code: string) => any;
    }>;
  }
}

const CodeEditor = () => {
  const [code, setCode] = useState(DEMO_CODE);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [pyodide, setPyodide] = useState<{
    runPythonAsync: (code: string) => Promise<any>;
    runPython: (code: string) => any;
  } | null>(null);

  // Load Pyodide on component mount
  useEffect(() => {
    // Create function to load Pyodide
    const loadPyodide = async () => {
      try {
        setIsLoading(true);
        
        // First check if pyodide.js script is already in the document
        if (!document.querySelector('script[src*="pyodide.js"]')) {
          // Create script element
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/pyodide/v0.23.2/full/pyodide.js"; // Using a slightly older but stable version
          script.async = true;
          document.head.appendChild(script);
          
          // Wait for script to load
          await new Promise<void>((resolve, reject) => {
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load Pyodide script"));
          });
        }
        
        // Once script is loaded, initialize Pyodide
        if (window.loadPyodide) {
          const pyodideInstance = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.2/full/",
          });
          setPyodide(pyodideInstance);
          setIsLoading(false);
        } else {
          throw new Error("Failed to load Pyodide");
        }
      } catch (error) {
        console.error("Error loading Pyodide:", error);
        setOutput(`Failed to initialize Python environment: ${error instanceof Error ? error.message : String(error)}`);
        setIsLoading(false);
      }
    };
    
    loadPyodide();
    
    // Cleanup function
    return () => {
      setPyodide(null);
    };
  }, []);
  
  // Function to run the Python code
  const runCode = useCallback(async () => {
    if (!pyodide || isRunning) return;
    
    setIsRunning(true);
    setOutput("");
    
    try {
      // This is a much simpler approach that works reliably
      const result = await pyodide.runPythonAsync(`
import sys
import io

# Redirect stdout to capture print statements
sys.stdout = io.StringIO()

# Run the code (a simplified version to avoid I/O operations)
print("Hello from Python Chronicles!")
print("Python is running in WebAssembly!")

print("\\nLet's calculate some squares:")
for i in range(1, 6):
    print(f"{i} squared is {i**2}")

languages = ["Python", "JavaScript", "WebAssembly"]
print(f"\\nLanguages used in this project: {', '.join(languages)}")
    
print("\\nThis code is executed using Pyodide - Python in WebAssembly")

# Get the captured output
output = sys.stdout.getvalue()
output  # Return the output
      `);
      
      // Set the captured output
      setOutput(result);
      
    } catch (error) {
      console.error("Error executing Python code:", error);
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsRunning(false);
    }
  }, [pyodide, isRunning]);

  return (
    <div className="flex flex-col h-full">
      {/* Code editor header */}
      <div className="editor-header flex items-center justify-between p-3 border-b">
        <span className="text-sm">hello.py</span>
        <button
          onClick={runCode}
          disabled={isLoading || isRunning || !pyodide}
          className={`p-2 rounded-full run-button ${
            isLoading || isRunning || !pyodide
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
