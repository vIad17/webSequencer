import { http, HttpResponse } from 'msw';

export const authHandler = [
  http.post('/login', async ({ request }) => {
    const { username, password } = await request.json();

    if (username === 'Artem' && password === '1234') {
      return HttpResponse.json(
        {
          id: 2,
          accessToken: 'mock-token-abc123'
        },
        { status: 200 }
      );
    }

    return HttpResponse.json(
      { message: 'Invalid username or password' },
      { status: 401 }
    );
  })
];
