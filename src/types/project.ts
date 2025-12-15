export type UpdateProjectBody = {
  name?: string;
  link?: string;
};

export type Project = {
  name: string;
  tagNames: string[];
  isVisible: boolean;
  link: string | null;
  userId: number;
  autosave: boolean;
};
