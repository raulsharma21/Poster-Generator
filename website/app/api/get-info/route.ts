import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function GET(request: Request) {
  // Extract query parameter
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID missing.' }, { status: 400 });
  }

  const scriptPath = path.join(process.cwd(), 'scripts', 'search.py');

  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', [scriptPath, 'get-info', id]);

    let output = '';

    pythonProcess.stdout.on('data', (data) => (output += data.toString()));
    pythonProcess.stderr.on('data', (data) => console.error(`Python Error: ${data.toString()}`));

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(NextResponse.json({ result: output }, { status: 200 }));
      } else {
        reject(NextResponse.json({ error: 'Python script failed' }, { status: 500 }));
      }
    });
  });
}