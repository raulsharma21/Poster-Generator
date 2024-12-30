import { NextResponse } from 'next/server';

export async function GET(request: Request): Promise<Response> {
  const id = new URL(request.url).searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID missing.' }, { status: 400 });
  }
  const base_url = 'http://127.0.0.1:5000';
  try {
    const response = await fetch(`${base_url}/search?type=get-info&id=${id}`);
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch data.', details: await response.text() }, 
        { status: response.status }
      );
    }

    return NextResponse.json({result: await response.json(), status: 200});
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to fetch data.', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}


  // const scriptPath = path.join(process.cwd(), 'scripts', 'search.py');

  // return new Promise<Response>((resolve) => {
  //   const pythonProcess = spawn('python3', [scriptPath, 'get-info', id]);

  //   let output = '';

  //   pythonProcess.stdout.on('data', (data) => {
  //     output += data.toString();
  //   });

  //   pythonProcess.stderr.on('data', (data) => {
  //     console.error(`Python Error: ${data.toString()}`);
  //   });

  //   pythonProcess.on('close', (code) => {
  //     if (code === 0) {
  //       resolve(NextResponse.json({ result: output }, { status: 200 }));
  //     } else {
  //       resolve(NextResponse.json({ error: 'Python script failed' }, { status: 500 }));
  //     }
  //   });
  // });
