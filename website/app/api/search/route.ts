import { NextResponse } from 'next/server';

export async function GET(request: Request): Promise<Response> {
  // Extract query parameter
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const quantity = searchParams.get('quantity')

  if (!query || !quantity) {
    return NextResponse.json({ error: 'Part of query missing.' }, { status: 400 });
  }

  const base_url = 'https://harsh-myriam-posteroven-366b0757.koyeb.app/';
  try {
    const response = await fetch(
      `${base_url}/search?type=search&query=${query}&quantity=${quantity}`
    );

    if (!await response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch data.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ result: data }, { status: 200 })

  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to fetch data.', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


// const scriptPath = path.join(process.cwd(), 'scripts', 'search.py');

// return new Promise<Response>((resolve) => {
//   const pythonProcess = spawn('python', [scriptPath, 'search', query, quantity]);

//   let output = '';

//   pythonProcess.stdout.on('data', (data) => (output += data.toString()));
//   pythonProcess.stderr.on('data', (data) => console.error(`Python Error: ${data.toString()}`));

//   pythonProcess.on('close', (code) => {
//     if (code === 0) {
//       resolve(NextResponse.json({ result: output }, { status: 200 }));
//     } else {
//       resolve(NextResponse.json({ error: 'Python script failed' }, { status: 500 }));
//     }
//   });
// });
