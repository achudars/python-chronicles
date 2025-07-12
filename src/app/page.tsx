"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the CodeEditor component to avoid SSR issues with Pyodide
const CodeEditor = dynamic(() => import("@/components/CodeEditor"), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center">Loading Python environment...</div>,
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Main container layout */}
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="app-header p-4">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-white rounded-full h-4 w-4"></div>
              <h1 className="font-bold">Python Chronicles</h1>
            </div>
            <div className="ml-auto">
              <button className="share-button px-3 py-1 text-sm rounded-md">
                Share
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left side - Content area */}
          <div className="w-1/2 p-6 overflow-y-auto border-r content-panel">
            <h2 className="text-2xl font-bold mb-4">Python Chronicles</h2>
            <p className="mb-4">
              The purpose of this document is to outline the ideas behind Python code execution in the browser using WebAssembly.
            </p>

            <h3 className="text-xl font-bold mb-2 mt-6">Main Interface</h3>
            <p className="mb-4">
              This is the basic view where you can write and execute Python code. It uses a color palette inspired by nature, with mint greens and teals.
            </p>

            <h3 className="text-xl font-bold mb-2 mt-6">Running Python Code</h3>
            <p className="mb-4">
              When you click the play button, the Python code snippet is executed using Pyodide, a WebAssembly port of the Python interpreter.
            </p>

            <h3 className="text-xl font-bold mb-2 mt-6">Code Display</h3>
            <p className="mb-4">
              The code snippet is loaded and displayed in the editor on the right. You can modify the code and execute it to see the results.
            </p>
          </div>

          {/* Right side - Code editor */}
          <div className="w-1/2 overflow-hidden flex flex-col editor-panel">
            <CodeEditor />
          </div>
        </div>
      </div>
    </main>
  );
}
