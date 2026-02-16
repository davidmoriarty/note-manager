export type ApiResponse = {
  message: string;
  success: true;
};

export type UserDto = {
  id: number;
  email: string;
  name: string;
};

export type NoteDto = {
  id: number;
  title: string;
  content: string;
};
