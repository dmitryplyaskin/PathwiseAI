export interface User {
  id: string;
  username: string;
  email: string;
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
}
