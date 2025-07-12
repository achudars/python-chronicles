"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { loadPyodide, type PyodideInterface } from "pyodide";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { PlayIcon } from "./Icons";

const CodeEditor = () => {
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const pyodideRef = useRef<any>(null);

    // Load Pyodide and the Python file when the component mounts
    useEffect(() => {
        const initPyodide = async () => {
            try {
                setIsLoading(true);
                // Initialize Pyodide
                pyodideRef.current = await loadPyodide();

                // Fetch the Python code from the file
                const response = await fetch("/hello.py");
                const pythonCode = await response.text();
                setCode(pythonCode);

                setIsLoading(false);
            } catch (error) {
                console.error("Failed to initialize Pyodide:", error);
                setOutput("Error: Failed to initialize Python environment");
                setIsLoading(false);
            }
        };

        initPyodide();
    }, []);

    // Function to run Python code
    const runCode = useCallback(async () => {
        if (!pyodideRef.current || isRunning) return;

        setIsRunning(true);
        setOutput("");

        try {
            // Create a new output handler to capture print statements
            // Set up stdout to capture print statements
            pyodideRef.current.setStdout({
                batched: (output: string) => {
                    setOutput(prev => prev + output + "\n");
                }
            });

            // Run the code
            const result = await pyodideRef.current.runPythonAsync(code);
            if (result !== undefined) {
                setOutput(prev => prev + String(result) + "\n");
            }
        } catch (error) {
            console.error("Error executing Python code:", error);
            setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsRunning(false);
        }
    }, [code, isRunning]);

    return (
        <div className="flex flex-col h-full">
            {/* Code editor header */}
            <div className="bg-[#333] flex items-center justify-between p-3 border-b border-gray-600">
                <span className="text-sm">hello.py</span>
                <button
                    onClick={runCode}
                    disabled={isLoading || isRunning}
                    className={`p-2 rounded-full ${isLoading || isRunning ? 'bg-gray-700' : 'bg-green-600 hover:bg-green-700'} transition-colors`}
                    aria-label="Run Python code"
                    title="Run Python code"
                >
                    <PlayIcon />
                </button>
            </div>

            {/* Code editor */}
            <div className="flex-1 overflow-hidden">
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
            </div>

            {/* Output console */}
            <div className="h-1/4 min-h-[100px] bg-[#1e1e1e] border-t border-gray-600 p-3 text-gray-300 font-mono overflow-y-auto">
                <div className="text-xs text-gray-400 mb-1">Output:</div>
                <pre className="whitespace-pre-wrap">{output || "Run the code to see the output"}</pre>
            </div>
        </div>
    );
};

export default CodeEditor;
