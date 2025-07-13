import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const pythonDir = path.join(process.cwd(), 'public', 'python', 'src');
    const files = await fs.readdir(pythonDir);
    
    // Filter for .py files and exclude __init__.py
    const pythonFiles = files
      .filter(file => file.endsWith('.py') && file !== '__init__.py')
      .sort((a, b) => {
        // Ensure hello.py is always first
        if (a === 'hello.py') return -1;
        if (b === 'hello.py') return 1;
        return a.localeCompare(b);
      });

    return NextResponse.json({ files: pythonFiles });
  } catch (error) {
    console.error('Error reading Python files:', error);
    return NextResponse.json({ error: 'Failed to read Python files' }, { status: 500 });
  }
}
