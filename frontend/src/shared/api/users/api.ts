import { type User } from './types';

const API_BASE_URL = 'http://localhost:3000/api';

export const usersApi = {
  getUserByUsername: async (username: string): Promise<User> => {
    const response = await fetch(
      `${API_BASE_URL}/users/by-username/${username}`,
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch user with username ${username}`);
    }
    return response.json();
  },
};
