import { http, HttpResponse } from 'msw';

const projectsDB = {
  1: {
    id: 1,
    name: 'My first track!',
    tags: ['electronic', 'ambient'],
    isVisible: true,
    autosave: true,
    link: 'H4sIAAAAAAAAA02PwW6DMBBE...'
  },
  2: {
    id: 2,
    name: 'Synt Project',
    tags: ['synt', 'retrowave'],
    isVisible: true,
    autosave: false,
    link: 'H4sIAAAAAAAAA02PwG6DMBBE...'
  }
};

export const projectHandlers = [
  http.get('/api/projects/:projectId/name', ({ params }) => {
    const { projectId } = params;
    const id = Number(projectId);

    const project = projectsDB[id as keyof typeof projectsDB];

    if (!project) {
      return HttpResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({ name: project.name });
  }),

  http.put('/api/projects/:projectId', async ({ params, request }) => {
    const { projectId } = params;
    const id = Number(projectId);
    const updateData = await request.json();

    // Поиск проекта
    const project = projectsDB[id as keyof typeof projectsDB];

    if (!project) {
      return HttpResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    Object.assign(projectsDB[id], {
      ...project,
      ...updateData,
      id: project.id
    });

    return HttpResponse.json({
      message: 'Project updated successfully',
      project: projectsDB[id]
    });
  })
];
