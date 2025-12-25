export type LoginRequestBody = {
  username: string;
  password: string;
};

export type UpdateRequestBody = {
  name?: string;
  link?: string;
  autosave?: boolean;
};

export type Project = {
  name: string;
  tagNames: string[];
  isVisible: boolean;
  link: string;
  userId: number;
  autosave: boolean;
};
