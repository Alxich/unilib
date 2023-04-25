export interface CreateUsernameData {
  createUsername: {
    success: boolean;
    error: string;
  };
}

export interface CreateUsernameVariables {
  username: string;
}

export interface UserVariables {
  id: string;
  username: string;
  name: string;
  email: string;
  image: string;
}
