import { http, HttpResponse } from 'msw';

import { Project, UpdateRequestBody } from 'src/shared/lib/msw/types';

const projects: Record<string, Project> = {
  '1': {
    name: 'Atomic Pulse',
    tagNames: ['space', 'experimental', 'vaporwave'],
    isVisible: true,
    link: 'H4sIAAAAAAAAA42RwW6DMAyG38VnDhDoSrlNmvoC3W3aIYBbooWEJaYVQrz7DIypICHtlt%2F58vu304OxhP7VOdlB9tFPErLoFIAkksXXu6pZx3EAZeskKWsgS4ZgAYVYg%2BK0ByZrMAn3wOOm9XEP3GQULztgHK3BaNfxsAbTfw4dbWb5DMAjkTI3D1kPeVMzIxjiJ8SldGDAtqa8PFF3q9vRLFy8p2OJxfgxfPKtJ6nYn6dxqFH6GSaHtdX27PC7RVN0z8U3bKj69dGym9OyuiKW%2BV8L5cm6OTvLXI0RI15mo6ioLpW60nSh7eOsNKHjBbCs1K1adBqGXHnIO9uDVwZhGH4AUh2sfVoCAAA%3D',
    userId: 2,
    autosave: false
  },
  '2': {
    name: 'Quantum Drive',
    tagNames: ['science', 'innovation', 'tech'],
    isVisible: false,
    link: 'H4sIAAAAAAAAA3WPz26DMAyH38XnHIDuD%2bI2aeoLdLdphwBuYy0kNHFaIcS7z8A6tZO4%2bXO%2b/GyP4DxjfAtBD1B9jgtClZcKNLNuvj%2boE356VtCmoJm8E5rUlrjbbYmvj2KxKf5LLPJH8UtBRGZypwjVCHXfyZ8iUyBfWFrlJIJPrj3cWRdv0xyW3bKXssVmvlqqmCJrknwZFtCijqvMATtv/T7gOaFrhvvmO/ZsfnOsHtZthY6Ibf03giL7sO4uWNO8Yv6ioCduzMHQkZcH6697soxBDhY0dDI3LrNMOld9kXiI5BCm6QdKUb1vtwEAAA==',
    userId: 2,
    autosave: true
  },
  '3': {
    name: 'Nebula Explorer',
    tagNames: ['space', 'research'],
    isVisible: true,
    link: '',
    userId: 1,
    autosave: false
  }
};



export const projectHandler = [
   http.get('/projects/:id', ({ params }) => {
    const { id } = params;

    if (typeof id !== 'string' || !projects[id]) {
      return HttpResponse.json(
        { message: 'Project is not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(
      projects[id],
      { status: 200 }
    );
  }),

  http.get('/projects/:id/name', ({ params }) => {
    const { id } = params;

    if (typeof id !== 'string' || !projects[id]) {
      return HttpResponse.json(
        { message: 'Project is not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(
      { name: projects[id].name ?? 'Unknown Project' },
      { status: 200 }
    );
  }),

  http.get('/projects/:id/link', ({ params }) => {
    const { id } = params;

    if (typeof id !== 'string' || !projects[id]) {
      return HttpResponse.json(
        { message: 'Project is not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(
      {
        link:
          projects[id].link ??
          'H4sIAAAAAAAAA1WPwW6DMBBE%2F2XPPkBUtYFbpSo%2FkNyqHAxs4lWNTex1EEL8exYoUXLbGb8dz47gPGP8DkEPUP6Oi4Qy%2F1KgmXX9d6J21oWCJgXN5B2UH5N6gsU7uPt8B88KIjKTu0YoR6i6VnZ2mQJZYbH2kwA%2Bueb4Qt29TXNYtmUvY4P13FGmmCJrkvxcQUCLOq4wB2y99YeAt4SuHl7NH%2BzY%2FOdYPaxtRV0Qm%2Br5BUX2Ye0usqK5Yi4ndcS1ORq68PJgfX8gyxjkYJGGrmbT%2BywTp9d3iYdIDmGaHtqLLbhlAQAA'
      },
      { status: 200 }
    );
  }),

  http.get('/projects/:id/userId', ({ params }) => {
    const { id } = params;

    if (typeof id !== 'string' || !projects[id]) {
      return HttpResponse.json(
        { message: 'Project is not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(
      { name: projects[id].userId ?? null },
      { status: 200 }
    );
  }),

  http.put('/projects/:id', async ({ request, params }) => {
    const { id } = params;
    const { name = '', link = '', autosave = false } = await request.json() as Project;

    if (typeof id !== 'string' || !projects[id]) {
      return HttpResponse.json(
        { message: 'Project is not found' },
        { status: 404 }
      );
    }

    const { name: prjName = '', link: prjLink = '' } =
      (await request.json()) as UpdateRequestBody;
    return HttpResponse.json({
      status: 200
    });
  })
];
