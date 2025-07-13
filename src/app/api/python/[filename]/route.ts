import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    
    // Validate filename to prevent directory traversal
    if (!filename || filename.includes('..') || !filename.endsWith('.py')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    let filePath: string;
    
    // Check if this is a test file path (contains 'tests/')
    if (filename.startsWith('tests/')) {
      // Remove 'tests/' prefix and construct path to tests directory
      const testFileName = filename.replace('tests/', '');
      filePath = path.join(process.cwd(), 'public', 'python', 'tests', testFileName);
    } else {
      // Regular source file in src directory
      filePath = path.join(process.cwd(), 'public', 'python', 'src', filename);
    }
    
    // Read the file
    const content = await readFile(filePath, 'utf-8');
    
    // Return the file content as plain text
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error reading Python file:', error);
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
