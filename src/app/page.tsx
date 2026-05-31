"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

// Dynamically import the CodeEditor component to avoid SSR issues with Pyodide
const CodeEditor = dynamic(() => import("@/components/CodeEditor"), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center">Loading Python environment...</div>,
});

export default function Home() {
  const [activeTab, setActiveTab] = useState("hello.py");
  const [pythonFiles, setPythonFiles] = useState<string[]>(["hello.py", "add.py"]); // fallback files
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);

  // Load Python files from the API
  const loadPythonFiles = useCallback(async () => {
    try {
      setIsLoadingFiles(true);
      const response = await fetch('/api/python/files');
      if (response.ok) {
        const data = await response.json();
        setPythonFiles(data.files || ["hello.py", "add.py"]);

        // Ensure activeTab is valid, default to first file (should be hello.py)
        if (data.files && data.files.length > 0 && !data.files.includes(activeTab)) {
          setActiveTab(data.files[0]);
        }
      } else {
        console.error('Failed to load Python files');
        // Keep fallback files
      }
    } catch (error) {
      console.error('Error loading Python files:', error);
      // Keep fallback files
    } finally {
      setIsLoadingFiles(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadPythonFiles();
  }, [loadPythonFiles]);

  return (
    <main className="flex min-h-screen">
      {/* Sidebar */}
      <div className="app-sidebar min-h-screen flex flex-col">
        {/* Branding */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <span>Py</span>
          </div>
          <span className="sidebar-brand-name">Python Chronicles</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 pt-5">
          <p className="sidebar-section-label">Files</p>

          {isLoadingFiles ? (
            <div className="sidebar-loading">Loading…</div>
          ) : (
            <div className="space-y-0.5">
              {pythonFiles.map((filename) => (
                <button
                  key={filename}
                  className={`sidebar-menu-item-rounded ${activeTab === filename ? "active" : ""}`}
                  onClick={() => setActiveTab(filename)}
                >
                  <svg className="w-3.5 h-3.5 flex-shrink-0 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                  {filename}
                </button>
              ))}
            </div>
          )}
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="app-header px-5 py-3 flex items-center justify-between">
          <span className="header-file">{activeTab}</span>
          <span className="badge">Python 3 · WebAssembly</span>
        </header>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden p-5 gap-4">
          {/* Left side — info panel */}
          <div className="content-panel info-panel rounded-xl overflow-y-auto custom-scrollbar flex flex-col gap-4 p-6">
            <div className="info-panel-header">
              <h2 className="info-panel-title">Python Playground</h2>
              <p className="info-panel-desc">
                Execute Python directly in your browser using WebAssembly — no server required.
              </p>
            </div>

            <div className="info-card">
              <h3 className="info-card-label">Interface</h3>
              <p className="info-card-text">
                Select a file from the sidebar to load it in the editor. Switch between source and test views using the toggle.
              </p>
            </div>

            <div className="info-card">
              <h3 className="info-card-label">Running Code</h3>
              <p className="info-card-text">
                Press the run button to execute the snippet with Pyodide. Output appears in the console below the editor.
              </p>
            </div>

            <div className="info-card">
              <h3 className="info-card-label">Environment</h3>
              <p className="info-card-text">
                Pyodide initialises once per session. Subsequent runs reuse the existing environment for faster execution.
              </p>
            </div>
          </div>

          {/* Right side — code editor */}
          <div className="right-panel rounded-xl overflow-hidden flex flex-col flex-1">
            <CodeEditor currentFile={activeTab} />
          </div>
        </div>
      </div>
    </main>
  );
}
