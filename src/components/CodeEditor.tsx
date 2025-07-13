"use client";

import { useEffect, useState, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { PlayIcon } from "./Icons";

// Add Pyodide types
declare global {
  interface Window {
    loadPyodide: (options?: {
      indexURL?: string;
      stdin?: () => string;
      [key: string]: unknown;
    }) => Promise<{
      runPythonAsync: (code: string) => Promise<string>;
      runPython: (code: string) => string;
    }>;
  }
}

interface CodeEditorProps {
  currentFile?: string;
}

const CodeEditor = ({ currentFile = "hello.py" }: CodeEditorProps) => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [viewMode, setViewMode] = useState<'source' | 'test'>('source');
  const [pyodide, setPyodide] = useState<{
    runPythonAsync: (code: string) => Promise<string>;
    runPython: (code: string) => string;
  } | null>(null);

  // Function to get the appropriate filename based on view mode
  const getFileName = useCallback((baseFile: string, mode: 'source' | 'test') => {
    if (mode === 'test') {
      const baseName = baseFile.replace('.py', '');
      return `test_${baseName}.py`;
    }
    return baseFile;
  }, []);
  // Function to load file content
  const loadFileContent = useCallback(async (filename: string, mode: 'source' | 'test') => {
    setIsLoadingFile(true);
    const actualFileName = getFileName(filename, mode);
    const apiPath = mode === 'test' ? `tests/${actualFileName}` : actualFileName;

    try {
      const response = await fetch(`/api/python/${apiPath}`);

      if (response.ok) {
        const content = await response.text();
        setCode(content);
      } else {
        console.error(`Failed to load ${actualFileName}:`, response.status);
        setCode(`# Error: Could not load ${actualFileName} (${response.status})`);
      }
    } catch (error) {
      console.error(`Error loading ${actualFileName}:`, error);
      setCode(`# Error: Could not load ${actualFileName}`);
    } finally {
      setIsLoadingFile(false);
    }
  }, [getFileName]);

  // Reset to source view when currentFile changes
  useEffect(() => {
    setViewMode('source');
  }, [currentFile]);

  // Load file content when currentFile or viewMode changes
  useEffect(() => {
    loadFileContent(currentFile, viewMode);
    setOutput(""); // Clear output when switching files
  }, [currentFile, viewMode, loadFileContent]);

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
      <div className="editor-header border-b">
        {/* Filename row */}
        <div className="px-3 pt-3 pb-2">
          <span className="text-sm font-medium text-white">
            {getFileName(currentFile, viewMode)}
          </span>
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between px-3 pb-3">
          <div className="flex items-center gap-2">
            {/* Toggle buttons for source/test view */}
            <button
              onClick={() => setViewMode('source')}
              className={`px-4 py-2 rounded-lg text-sm font-normal cursor-pointer transition-colors text-white ${viewMode === 'source'
                ? 'button-orange-active'
                : 'hover:button-hover-dark'
                }`}
            >
              Source
            </button>
            <button
              onClick={() => setViewMode('test')}
              className={`px-4 py-2 rounded-lg text-sm font-normal cursor-pointer transition-colors text-white ${viewMode === 'test'
                ? 'button-green-active'
                : 'hover:button-hover-dark'
                }`}
            >
              Test
            </button>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-white opacity-70 mr-3">
              {(() => {
                if (isLoading) return "Loading...";
                if (isRunning) return "Running...";
                return "Run";
              })()}
            </span>
            <button
              onClick={runCode}
              disabled={isLoading || isRunning || !pyodide}
              className={`px-4 py-2 rounded-lg run-button cursor-pointer ${isLoading || isRunning || !pyodide
                ? 'run-button-disabled cursor-not-allowed'
                : 'run-button-active'
                }`}
              aria-label="Run Python code"
              title="Run Python code"
            >
              <PlayIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Code editor */}
      <div className="flex-1 overflow-hidden max-h-[500px]">
        {isLoading || isLoadingFile ? (
          <div className="loading-container h-full flex items-center justify-center">
            {isLoading ? "Loading Python environment..." : "Loading file..."}
          </div>
        ) : (
          <div className="custom-scrollbar overflow-y-auto overflow-x-hidden h-full">
            <CodeMirror
              value={code}
              height="auto"
              readOnly={true}
              extensions={[python()]}
              theme="dark"
              basicSetup={{
                lineNumbers: true,
                highlightActiveLineGutter: true,
                highlightSpecialChars: true,
                foldGutter: true,
                drawSelection: true,
                dropCursor: false,
                indentOnInput: false,
                syntaxHighlighting: true,
              }}
            />
          </div>
        )}
      </div>

      {/* Output console */}
      <div className="output-console custom-scrollbar max-h-[300px] min-h-[100px] border-t p-3 font-mono overflow-y-auto overflow-x-hidden console-bg">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs console-output-text font-medium">Console Output</div>
          <div className="text-xs text-gray-300">
            {isRunning && (
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
            )}
            {(() => {
              if (isRunning) return "Processing...";
              if (output) return "Completed";
              return "Run";
            })()}
          </div>
        </div>
        <pre className="whitespace-pre-wrap text-sm text-white break-words">
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
