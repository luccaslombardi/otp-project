export interface User {
  id: string;
  username: string;
  password: string;
}

export interface UserRepository {
  findByUsername(username: string): Promise<User | null>;
}