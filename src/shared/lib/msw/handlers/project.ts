import { http, HttpResponse } from 'msw';
import { Project, UpdateProjectBody } from 'src/types/project';

export const projectHandler = [
  http.get('/projects/:id', ({ params }) => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const projects: Record<string, Omit<Project, 'isLoading'>> = {
      1: {
        name: 'Atomic Pulse',
        tagNames: ['space', 'experimental', 'vaporwave'],
        isVisible: true,
        link: 'H4sIAAAAAAAAA42RwW6DMAyG38VnDhDoSrlNmvoC3W3aIYBbooWEJaYVQrz7DIypICHtlt%2F58vu304OxhP7VOdlB9tFPErLoFIAkksXXu6pZx3EAZeskKWsgS4ZgAYVYg%2BK0ByZrMAn3wOOm9XEP3GQULztgHK3BaNfxsAbTfw4dbWb5DMAjkTI3D1kPeVMzIxjiJ8SldGDAtqa8PFF3q9vRLFy8p2OJxfgxfPKtJ6nYn6dxqFH6GSaHtdX27PC7RVN0z8U3bKj69dGym9OyuiKW%2BV8L5cm6OTvLXI0RI15mo6ioLpW60nSh7eOsNKHjBbCs1K1adBqGXHnIO9uDVwZhGH4AUh2sfVoCAAA%3D',
        userId: 2,
        autosave: false
      },
      2: {
        name: 'Quantum Drive',
        tagNames: ['science', 'innovation', 'tech'],
        isVisible: false,
        link: 'H4sIAAAAAAAAA3WPz26DMAyH38XnHIDuD%2bI2aeoLdLdphwBuYy0kNHFaIcS7z8A6tZO4%2bXO%2b/GyP4DxjfAtBD1B9jgtClZcKNLNuvj%2boE356VtCmoJm8E5rUlrjbbYmvj2KxKf5LLPJH8UtBRGZypwjVCHXfyZ8iUyBfWFrlJIJPrj3cWRdv0xyW3bKXssVmvlqqmCJrknwZFtCijqvMATtv/T7gOaFrhvvmO/ZsfnOsHtZthY6Ibf03giL7sO4uWNO8Yv6ioCduzMHQkZcH6697soxBDhY0dDI3LrNMOld9kXiI5BCm6QdKUb1vtwEAAA==',
        userId: 2,
        autosave: true
      },
      3: {
        name: 'Nebula Explorer',
        tagNames: ['space', 'research'],
        isVisible: true,
        link: '',
        userId: 1,
        autosave: false
      }
    };

    const project = projects[id] ?? {
      name: 'Unknown Project',
      tagNames: [],
      isVisible: false,
      link: 'H4sIAAAAAAAAA42Tz27CMAzG3yXnaupfGnqbNPEC7DbtEFpDo7UNS1wQQn33uWVDw5IlbnHyy2f7i3NVg0MIr96bi6o%2brkuoqjSLlEE09de77SleRaoZvUHrBlXlU3TnkkcuSSQwZmApgekjmK4lsGSgqLhiqfWzYCaB%2blnFgtkogRmzpywkkNVY5FLq/BHMxRqZ4VryMWMzoSV7MvYyOhbAnHW9ErtmY1Y8a08mgTlTTJmPn5EKgGiHQ1DVVe2OPT3zPMR0BWlLTwS4cWi2/6iT68ZZ7N7Wsmygnv9W/LImX8IY0FhKQfk9dGACLGv00LvObTx8jzDUl%2bXm7%2bYbHLGdBcrZcejM5VYzEXuAZndPZAM6f%2buAwp2dC03IkaPFut22do/LQefOG9sh%2bNu3bO2h/Yt1HNPO2ZxIXgU7gJqmH6h7miwjBAAA',
      userId: 99,
      autosave: false
    };

    return HttpResponse.json(project, { status: 200 });
  }),

  http.put('/projects/:id', async ({ request, params }) => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const { name = '', link = '' } =
      (await request.json()) as UpdateProjectBody;
    return HttpResponse.json({
      status: 200
    });
  })
];
