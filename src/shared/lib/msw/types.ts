export type LoginRequestBody = {
  username: string;
  password: string;
};

export type UpdateRequestBody = {
  name?: string;
  link?: string;
};

export type Project = {
  name: string;
  tagNames: string[];
  isVisible: boolean;
  link: string;
  userId: number;
  autosave: boolean;
};
