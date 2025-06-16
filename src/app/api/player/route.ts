import { NextResponse } from 'next/server';

const API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjJlMTE1ZDAwLWU2YjctNDFiYi04ZDE3LTk0OWE2YjhjYjc3YiIsImlhdCI6MTc1MDA0NzM3Miwic3ViIjoiZGV2ZWxvcGVyLzUwZGJiOTlmLTJlZDItZjRjYS1iMjExLWRlNTIyNGU4MDA1ZSIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjIwMi4xODQuNDkuMTkyIl0sInR5cGUiOiJjbGllbnQifV19.OciJ9-o0-Q08tj2CAmd4xJlA40Wbf8JzAzWHBBHhdfDTRD2FabiyATP7oPAfkbhFAEgf5ryE2hwCj-F-YnGdjQ';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const playerTag = searchParams.get('tag');

  if (!playerTag) {
    return NextResponse.json({ error: 'Player tag is required' }, { status: 400 });
  }

  // Ensure the tag starts with '#' and encode it
  const formattedTag = encodeURIComponent(playerTag.startsWith('#') ? playerTag : `#${playerTag}`);
  console.log('Formatted tag:', formattedTag);

  try {
    const apiUrl = `https://api.clashofclans.com/v1/players/${formattedTag}`;
    console.log('API URL:', apiUrl);

    const response = await fetch(
      apiUrl,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Accept': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Handle specific error cases
      switch (response.status) {
        case 403:
          return NextResponse.json(
            { 
              error: 'API access forbidden. This usually means your IP address is not whitelisted in the API key settings.',
              details: data
            }, 
            { status: 403 }
          );
        case 404:
          return NextResponse.json(
            { 
              error: 'Player not found. Please check if the tag is correct.',
              details: data
            }, 
            { status: 404 }
          );
        case 429:
          return NextResponse.json(
            { 
              error: 'Too many requests. Please try again later.',
              details: data
            }, 
            { status: 429 }
          );
        default:
          return NextResponse.json(
            { 
              error: `API Error: ${data.message || 'Unknown error'}`,
              details: data
            }, 
            { status: response.status }
          );
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching player data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch player data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 