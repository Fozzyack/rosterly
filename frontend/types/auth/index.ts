export type SignupRequest = {
  name: string;
  email: string;
  password: string;
};

export type AuthErrorResponse = {
  error: string;
};
