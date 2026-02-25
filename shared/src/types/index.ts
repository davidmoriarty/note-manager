export type ApiResponse =
  | { success: true; message: string }
  | { success: false; message: string };

export type UserBaseDto = {
  id: number;
  name: string;
  email: string;
};

export type UserDto = UserBaseDto & {
  emailVerified: boolean;
  memberSince: string;
  lastLoginAt: string | null;
};

export type MeStatsDto = {
  totalNotes: number;
};

export type NoteDto = {
  id: number;
  title: string;
  content: string;
  authorId: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};
