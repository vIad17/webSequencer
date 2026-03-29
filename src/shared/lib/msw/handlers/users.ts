import { http, HttpResponse } from 'msw';

export const userHandler = [
  http.get('/users/0', () => {
    return HttpResponse.json({
      id: 2,
      username: 'Artem',
      avatar_id: 123,
      bio: 'Music producer'
    });
  })
];
