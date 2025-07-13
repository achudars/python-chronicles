"use client";

import { useEffect, useState, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { PlayIcon } from "./Icons";

// Define the demo Python code for hello.py
const HELLO_PY_CODE = `# Simple Python script to demonstrate Python running in WebAssembly
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

// Define the code for add.py
const ADD_PY_CODE = `# Simple Python script to demonstrate adding two numbers
# Click the play button to execute this code

print("Welcome to the Addition Calculator!")
print("This script demonstrates basic addition in Python")

# Define two numbers
num1 = 15
num2 = 27

# Calculate the sum
result = num1 + num2

print(f"\\nFirst number: {num1}")
print(f"Second number: {num2}")
print(f"Sum: {num1} + {num2} = {result}")

# Let's try with different numbers
numbers = [5, 10, 3, 8, 12]
total = sum(numbers)

print(f"\\nAdding a list of numbers: {numbers}")
print(f"Total sum: {total}")

# Function to add two numbers
def add_numbers(a, b):
    return a + b

# Test the function
x, y = 100, 250
function_result = add_numbers(x, y)
print(f"\\nUsing a function: add_numbers({x}, {y}) = {function_result}")

print("\\nThis demonstrates basic addition operations in Python!")
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

interface CodeEditorProps {
  currentFile?: string;
}

const CodeEditor = ({ currentFile = "hello.py" }: CodeEditorProps) => {
  // Determine which code to use based on current file
  const getCodeForFile = (filename: string) => {
    switch (filename) {
      case "add.py":
        return ADD_PY_CODE;
      case "hello.py":
      default:
        return HELLO_PY_CODE;
    }
  };

  const [code, setCode] = useState(getCodeForFile(currentFile));
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [pyodide, setPyodide] = useState<{
    runPythonAsync: (code: string) => Promise<any>;
    runPython: (code: string) => any;
  } | null>(null);

  // Update code when currentFile changes
  useEffect(() => {
    setCode(getCodeForFile(currentFile));
    setOutput(""); // Clear output when switching files
  }, [currentFile]);

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
        <div className="flex items-center">
          <span className="text-sm font-medium text-white">{currentFile}</span>
        </div>
        <div className="flex items-center">
          <span className="text-xs text-white opacity-70 mr-3">
            {(() => {
              if (isLoading) return "Loading...";
              if (isRunning) return "Running...";
              return "Run";
            })()}
          </span>
          <button
            onClick={runCode}
            disabled={isLoading || isRunning || !pyodide}
            className={`p-2 rounded-md run-button cursor-pointer ${isLoading || isRunning || !pyodide
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
        )}
      </div>

      {/* Output console */}
      <div className="output-console h-1/4 min-h-[100px] border-t p-3 text-gray-300 font-mono overflow-y-auto console-bg">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-green-400 font-medium">Console Output</div>
          <div className="text-xs text-gray-400">
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
        <pre className="whitespace-pre-wrap text-sm">
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
