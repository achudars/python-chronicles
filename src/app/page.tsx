"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the CodeEditor component to avoid SSR issues with Pyodide
const CodeEditor = dynamic(() => import("@/components/CodeEditor"), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center">Loading Python environment...</div>,
});

export default function Home() {
  const [activeTab, setActiveTab] = useState("hello.py");

  return (
    <main className="flex min-h-screen">
      {/* Sidebar */}
      <div className="app-sidebar h-screen flex flex-col">
        {/* Navigation */}
        <nav className="flex-1 px-4 pt-6">
          <div className="mb-8">
            <h3 className="text-white text-lg font-medium mb-4 px-2">Problems</h3>

            <div className="space-y-1">
              <button
                className={`sidebar-menu-item-rounded w-full text-left ${activeTab === "hello.py" ? "active" : ""}`}
                onClick={() => setActiveTab("hello.py")}
              >
                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path>
                </svg>
                hello.py
              </button>

              <button
                className={`sidebar-menu-item-rounded w-full text-left ${activeTab === "add.py" ? "active" : ""}`}
                onClick={() => setActiveTab("add.py")}
              >
                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path>
                </svg>
                add.py
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="app-header p-4">
          <div className="flex items-center">
            <div>
              <h1 className="font-bold text-xl">Python Chronicles</h1>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden p-6 gap-6">
          {/* Left side - Content area */}
          <div className="w-1/2 bg-white rounded-lg p-6 shadow overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Python Playground</h2>
            <p className="mb-4 text-gray-800 leading-relaxed">
              The purpose of this document is to outline the ideas behind Python code execution in the browser using WebAssembly.
            </p>

            <div className="bg-gray-50 rounded-lg p-5 border mb-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Main Interface</h3>
              <p className="text-gray-700 leading-relaxed">
                This is the basic view where you can write and execute Python code. It uses a color palette inspired by the attached dashboard design.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-5 border">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Running Python Code</h3>
              <p className="text-gray-700 leading-relaxed">
                When you click the play button, the Python code snippet is executed using Pyodide, a WebAssembly port of the Python interpreter.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-5 border mt-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Code Display</h3>
              <p className="text-gray-700 leading-relaxed">
                The code snippet is loaded and displayed in the editor on the right. You can modify the code and execute it to see the results.
              </p>
            </div>
          </div>

          {/* Right side - Code editor */}
          <div className="w-1/2 right-panel rounded-lg shadow overflow-hidden flex flex-col">
            <CodeEditor currentFile={activeTab} />
          </div>
        </div>
      </div>
    </main>
  );
}
