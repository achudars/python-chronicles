import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const pathSegments = params.path;
    
    if (!pathSegments || pathSegments.length === 0) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }
    
    // Validate all path segments
    for (const segment of pathSegments) {
      if (!segment || segment.includes('..')) {
        return NextResponse.json({ error: 'Invalid path segment' }, { status: 400 });
      }
    }
    
    // The last segment should be a Python file
    const filename = pathSegments[pathSegments.length - 1];
    if (!filename.endsWith('.py')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    let filePath: string;
    
    // Check if this is a test file path (starts with 'tests')
    if (pathSegments[0] === 'tests') {
      // Construct path to tests directory
      filePath = path.join(process.cwd(), 'public', 'python', ...pathSegments);
    } else {
      // Regular source file in src directory
      filePath = path.join(process.cwd(), 'public', 'python', 'src', ...pathSegments);
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
